# How to Upload to Pinata (IPFS)

## What to upload (3 steps)

---

### Step 1 — Upload the preview image
- Create or export a flat PNG/JPEG preview of the business card from Blender
- Go to https://pinata.cloud → **Upload** → **File**
- Upload the image
- Copy the **CID** (looks like `QmXyz...` or `bafy...`)
- In `metadata.json`, replace `REPLACE_WITH_IMAGE_CID` with it:
  ```
  "image": "ipfs://QmYourImageCID"
  ```

---

### Step 2 — Upload the 3D model (.glb)
- File is at: `frontend/digitalassets/techjcorpcardasset.glb`
- Go to Pinata → **Upload** → **File**
- Upload `techjcorpcardasset.glb`
- Copy the **CID**
- In `metadata.json`, replace `REPLACE_WITH_GLB_CID` with it:
  ```
  "animation_url": "ipfs://QmYourGlbCID"
  ```

---

### Step 3 — Upload metadata.json
- Save `metadata.json` after filling in both CIDs above
- Go to Pinata → **Upload** → **File**
- Upload `metadata.json`
- Copy the **CID** — this is your `defaultTokenURI`
- In `BusinessCard.sol`, update:
  ```solidity
  string public defaultTokenURI = "ipfs://QmYourMetadataCID";
  ```

---

## After all 3 uploads

You will have 3 CIDs:
| File | Used in |
|------|---------|
| Preview image | `metadata.json` → `"image"` |
| `.glb` model | `metadata.json` → `"animation_url"` |
| `metadata.json` | `BusinessCard.sol` → `defaultTokenURI` |

Once `defaultTokenURI` is set in the contract, you are ready to deploy to Tenderly (Ticket-010).
