name: Daily Exposure Challenge

on:
  schedule:
    - cron: '0 7 * * *'
  workflow_dispatch:

jobs:
  add-challenge:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Run challenge
        env:
          HABITICA_USER_ID: ${{ secrets.HABITICA_USER_ID }}
          HABITICA_API_KEY: ${{ secrets.HABITICA_API_KEY }}
        run: node challenge.js
      
      - name: Commit count
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add count.json 2>/dev/null || true
          git commit -m "update challenge count" 2>/dev/null || true
          git push 2>/dev/null || true
