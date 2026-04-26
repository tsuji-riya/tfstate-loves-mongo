# tfstate loves mongo ⚡🍃😻

A GitHub Action that seamlessly manages your Terraform state files (`.tfstate`) using MongoDB as a backend. It automatically restores your state before a Terraform run and saves the updated state afterwards — keeping only the two most recent snapshots to avoid storage bloat.

---

## How It Works

This action runs in two phases:

**`main` (pre-step):** At the start of your job, the action connects to MongoDB and fetches the latest stored tfstate. If one exists, it is written to the destination path so Terraform can pick it up immediately.

**`post` (post-step):** After your job completes, the action reads the tfstate file from disk, compares it against the previously stored version, and — if changes are detected — saves the new state to MongoDB. It then prunes any snapshots beyond the two most recent to keep the collection lean.

```
Job starts
  └─ main.ts  → MongoDB → fetch latest tfstate → write to disk
       │
       ▼
  [ Your Terraform steps run here ]
       │
       ▼
  post.ts  → read tfstate from disk → compare → save to MongoDB → prune old snapshots
```

---

## Usage

```yaml
steps:
  - name: Manage tfstate with MongoDB
    uses: tsuji-riya/tfstate-loves-mongo@v1
    with:
      mongo-uri: ${{ secrets.MONGO_URI }}
      database: tfstate          # optional, default: "tfstate"
      collection: currently      # optional, default: "currently"
      destination: ./terraform.tfstate  # optional
```

> **Tip:** Always store your MongoDB URI in a GitHub Actions secret — never hard-code it in your workflow file.

---

## Inputs

| Input | Description | Required | Default |
|---|---|---|---|
| `mongo-uri` | MongoDB connection string (e.g. `mongodb+srv://...`) | ✅ Yes | — |
| `database` | Database name for storing tfstate | No | `tfstate` |
| `collection` | Collection name for storing tfstate | No | `currently` |
| `destination` | Local path where the `.tfstate` file will be read/written | No | `./terraform.tfstate` |

---

## MongoDB Document Schema

Each snapshot stored in MongoDB has the following shape:

```json
{
  "_id": "<ObjectId>",
  "date": "<ISODate>",
  "content": { /* full Terraform state object */ }
}
```

The collection is sorted by `date` descending, and only the **two most recent** documents are kept after each successful save.

---

## Example Workflow

```yaml
name: Terraform

on:
  push:
    branches:
      - main

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Manage tfstate with MongoDB
        uses: tsuji-riya/tfstate-loves-mongo@v1
        with:
          mongo-uri: ${{ secrets.MONGO_URI }}

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3

      - name: Terraform Init
        run: terraform init

      - name: Terraform Plan
        run: terraform plan

      - name: Terraform Apply
        run: terraform apply -auto-approve
```

---

## Requirements

- **Node.js 24** (specified in `action.yml`)
- A reachable **MongoDB** instance (Atlas or self-hosted)
- The MongoDB user must have **read and write** permissions on the target database and collection

---

## Branding

- Icon: `cloud-lightning`
- Color: `green`

---

## Author

Tsuji Riya

---
