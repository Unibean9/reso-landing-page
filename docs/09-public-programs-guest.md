# Luong Public Programs cho Guest

Luong nay dung cho guest mode hoac preview truoc khi dang nhap.

## 1. GET `/api/v1/public/programs`

Muc dich: lay danh sach program cong khai de hien thi o guest home/program preview.

Response:

```json
[
  {
    "id": "program-id",
    "name": "Bean Club",
    "description": "<p>HTML description</p>",
    "startDate": "2026-01-01T00:00:00Z",
    "expiredDate": null,
    "status": "RUNNING",
    "tiers": [
      {
        "id": "tier-id",
        "name": "Silver",
        "description": "Tier description",
        "mainColor": "#C0C0C0",
        "tierIndex": 1,
        "minPoint": 0,
        "maxPoint": 499
      }
    ],
    "campaigns": [
      {
        "id": "campaign-id",
        "name": "Summer Sale",
        "bannerImg": "https://...",
        "startDate": "2026-05-01T00:00:00Z",
        "expirationDate": "2026-06-01T00:00:00Z",
        "status": "RUNNING"
      }
    ]
  }
]
```

Ghi chu:

- App co helper loc theo status: `RUNNING`, `PLANNED`, `FINISHED`, `STOPPED`.
- App co helper strip HTML trong `description` de hien thi preview text.
