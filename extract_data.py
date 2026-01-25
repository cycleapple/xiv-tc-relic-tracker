# -*- coding: utf-8 -*-
import openpyxl
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

filepath = r'e:\Download\发光武器材料进度追踪表 1.52.xlsx'
wb = openpyxl.load_workbook(filepath)

# Read full sheets
sheets_to_read = ['古武', '魂武', '优武（含装备）', '义武（含装备清单）', '曼武', '幻武', '天钢工具（生产采集）']

for sheet_name in sheets_to_read:
    print(f"\n{'='*60}")
    print(f"=== {sheet_name} (FULL) ===")
    print(f"{'='*60}")
    ws = wb[sheet_name]
    for row_idx, row in enumerate(ws.iter_rows(max_row=50, values_only=True), 1):
        non_empty = [str(c) if c is not None else '' for c in row[:30]]
        # Only print if row has some content
        if any(c for c in non_empty):
            print(f"Row {row_idx}: {non_empty}")
