#!/bin/bash
start "" npm run dev --prefix User-Service
start "" tsc -w --project User-Service
start "" npm run dev --prefix Auth-Service
start "" tsc -w --project Auth-Service
start "" npm run dev --prefix Media-Service
start "" tsc -w --project Media-Service
