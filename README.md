# 🌳 AzGenealogy

**Azərbaycan Soy Ağacı Platforması** — ailə tarixini qorumaq, nəsilləri birləşdirmək üçün interaktiv veb tətbiq.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![vis-network](https://img.shields.io/badge/vis--network-graph-orange)
![Django](https://img.shields.io/badge/Django-5.2-092E20?logo=django&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Xüsusiyyətlər

### 🗂️ Soy ağacı (Qraf strukturu)
- **Həqiqi qraf** — `vis-network` kitabxanası ilə, bir şəxsin birdən çox valideynə malik olması dəstəklənir
- **Nikah əlaqələri** — ata və ana tərəfini ayrıca əlavə et, nikah xətti ilə birləşdir
- **Avtomatik uşaq bağlantısı** — nikahı olan şəxsə uşaq əlavə edildikdə hər iki valideyndən avtomatik `parent` edge yaranır
- **Valideyn əlavə et** — mövcud node-un üstünə yeni əcdad əlavə et
- Cüt klik ilə sürətli redaktə

### 👤 Şəxs məlumatları
- Ad, soyad, cins, doğum/vəfat ili, şəhər
- Peşə, təhsil, nikah tarixi, həyat yoldaşı
- 📸 **Foto yükləmə** (base64, maks 2MB)
- 📖 **Narativ** — hər şəxs üçün uzun hekayə/tarixi qeyd
- Coğrafi koordinatlar (xəritə üçün)

### 🔗 Əlaqə idarəsi
- Şəxs əlavə etmə səhifəsindən mövcud şəxslər arasında əlaqə əlavə et/sil
- Valideyn → Övlad əlaqəsi
- Nikah əlaqəsi (tarix, qeyd ilə)

### 🗺️ Xəritə
- Əcdadların yaşadığı yerləri Azərbaycan xəritəsində gör
- **Leaflet.js** + OpenStreetMap

### 🔍 Axtarış & Filtr
- Ad, şəhər, peşə üzrə axtarış
- Cins, şəhər, peşə, doğum ili aralığı ilə filtr

### 📊 Statistika
- Ümumi şəxs sayı, nəsil dərinliyi, nikah sayı
- Cins paylanması, doğum dövrü çizelgesi
- Top yerlər, top peşələr
- Çap / PDF export

### 🤝 Qohumluq hesablayıcı
- İki şəxs arasında qohumluq dərəcəsini BFS alqoritmi ilə müəyyən et
- Həm ata, həm ana xətti nəzərə alınır

### 🌲 Çoxlu ağac
- Bir neçə ayrı soy ağacı saxla
- Hər ailə qolu üçün müstəqil ağac

### 📤 Export / Import
- **JSON** formatında yüklə/bərpa et
- **GEDCOM** (.ged) standartı ilə ixrac

---

## 🛠️ Texnologiyalar

| Hissə | Texnologiya |
|-------|------------|
| Frontend | React 19, React Router v7 |
| Qraf vizualizasiyası | vis-network |
| Xəritə | Leaflet.js + react-leaflet |
| UI | Bootstrap 5, Bootstrap Icons |
| Backend (gələcək) | Django 5.2, Django REST Framework |
| Baza (gələcək) | MySQL 8 |
| Auth (gələcək) | JWT (SimpleJWT) |

---

## 🚀 Başlamaq

### Tələblər
- Node.js 18+
- npm 9+

### Quraşdırma

```bash
# Repo-nu klon et
git clone https://github.com/username/azgenealogy.git
cd azgenealogy

# Asılılıqları qur
npm install

# Development server-i başlat
npm start
```

Brauzer avtomatik `http://localhost:3000` ünvanını açacaq.

### Build

```bash
npm run build
```

---

## 🔧 Backend (Django) — hazırlıq mərhələsində

Backend `azgenealogy/` qovluğundadır.

```bash
cd azgenealogy

# .env faylı yarat
cp .env.example .env
# DB_PASSWORD və digər dəyərləri doldur

# Asılılıqları qur
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers mysqlclient

# MySQL bazasını yarat
# CREATE DATABASE azgenealogy CHARACTER SET utf8mb4;

# Migrate et
python manage.py migrate

# Server-i başlat
python manage.py runserver
```

### API Endpoint-lər

| Method | URL | Açıqlama |
|--------|-----|----------|
| POST | `/api/auth/register/` | Qeydiyyat |
| POST | `/api/auth/login/` | Giriş (JWT) |
| POST | `/api/auth/refresh/` | Token yenilə |
| POST | `/api/auth/logout/` | Çıxış |
| GET  | `/api/auth/me/` | Cari istifadəçi |
| GET  | `/api/forests/` | Ağacların siyahısı |
| POST | `/api/forests/` | Yeni ağac yarat |
| GET  | `/api/forests/<id>/` | Ağacı yüklə |
| PUT  | `/api/forests/<id>/` | Ağacı yenilə |
| DELETE | `/api/forests/<id>/` | Ağacı sil |

---

## 📁 Struktur

```
azgenealogy/
├── public/
├── src/
│   ├── components/
│   │   ├── graph/          # vis-network qraf komponentləri
│   │   │   ├── FamilyGraph.jsx
│   │   │   ├── NodePanel.jsx
│   │   │   └── EdgePanel.jsx
│   │   ├── header/         # Navbar
│   │   ├── footer/         # Footer
│   │   ├── person/         # Şəxs formaları
│   │   ├── forests/        # Çoxlu ağac modal
│   │   └── layout/         # PageLayout wrapper
│   ├── data/
│   │   └── graphData.js    # Qraf data strukturu və əməliyyatlar
│   ├── pages/
│   │   ├── LandingPage.jsx # Ana səhifə
│   │   ├── GraphHome.jsx   # Soy ağacı
│   │   ├── SearchPage.jsx  # Axtarış & Filtr
│   │   ├── AddPage.jsx     # Şəxs & Əlaqə əlavə et
│   │   ├── MapPage.jsx     # Xəritə
│   │   ├── RelationPage.jsx# Qohumluq hesablayıcı
│   │   ├── StatsPage.jsx   # Statistika
│   │   └── HelpPage.jsx    # Kömək
│   └── App.jsx
└── azgenealogy/            # Django backend
    ├── backend/            # Django settings, urls
    ├── api/                # Models, views, serializers
    └── manage.py
```

---

## 🗺️ Yol xəritəsi

- [x] Qraf əsaslı soy ağacı (vis-network)
- [x] Nikah əlaqələri
- [x] Çoxlu valideyn dəstəyi
- [x] Foto yükləmə
- [x] Narrativlər
- [x] Coğrafi xəritə
- [x] Qohumluq hesablayıcı
- [x] Export JSON / GEDCOM
- [x] Django backend scaffold
- [ ] JWT authentication (giriş/qeydiyyat)
- [ ] Bulud sinxronizasiyası
- [ ] Paylaşım linki
- [ ] Mobil tətbiq

---

## 📜 Lisenziya

MIT © 2025 AzGenealogy

---

> *"Öz kökünü bilmək — özünü tanımaqdan başlayır."*
