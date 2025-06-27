# Health Tracker

![health tracker](https://github.com/user-attachments/assets/49e52aae-175d-44be-8545-4b6d6024fdaf)


Health Tracker, kullanıcıların günlük sağlık verilerini (adım, mesafe, kalori, su, uyku vb.) kolayca takip edebileceği ve analiz edebileceği bir full-stack web uygulamasıdır.

---

## Proje Durumu

> **Not:** Proje halen geliştirme aşamasındadır. Eksik veya hatalı özellikler olabilir. Katkılarınızı ve geri bildirimlerinizi bekliyoruz!

---

## Kullanılan Teknolojiler

### Frontend

- **React**: Modern, bileşen tabanlı kullanıcı arayüzü geliştirme.
- **Vite**: Hızlı geliştirme ortamı ve derleyici.
- **TailwindCSS**: Hızlı ve esnek stil oluşturma.
- **Chart.js & react-chartjs-2**: Sağlık verilerinin grafiklerle görselleştirilmesi.
- **Axios**: API istekleri için HTTP istemcisi.
- **React Router**: Sayfa yönlendirme.
- **React Toastify**: Bildirimler.

### Backend

- **Node.js**: Sunucu tarafı JavaScript çalıştırma ortamı.
- **Express.js**: RESTful API geliştirme.
- **MongoDB**: NoSQL veritabanı.
- **Mongoose**: MongoDB ile kolay etkileşim için ODM.
- **JWT**: Kimlik doğrulama ve oturum yönetimi.
- **bcrypt**: Şifre güvenliği.

---

## Kurulum ve Çalıştırma

### 1. Backend

```sh
cd backend
npm install
npm run dev
```
- Varsayılan olarak `http://localhost:5000` adresinde çalışır.
- MongoDB bağlantı ayarlarını `.env` dosyasından yapabilirsiniz.

### 2. Frontend

```sh
cd frontend
npm install
npm run dev
```
- Varsayılan olarak `http://localhost:5173` adresinde çalışır.
- API adresini `.env` dosyasından ayarlayabilirsiniz.

---

## Özellikler

- Kullanıcı kaydı ve giriş işlemleri
- Günlük adım, mesafe, kalori, su, uyku ve ruh hali takibi
- Kişisel hedefler belirleme ve takip
- Günlük/haftalık/aylık sağlık raporları
- Grafiklerle veri görselleştirme
- Modern ve kullanıcı dostu arayüz

---

## Katkıda Bulunma

1. Projeyi fork'layın.
2. Yeni bir branch oluşturun (`git checkout -b yeni-ozellik`).
3. Değişikliklerinizi yapın ve commit edin.
4. Branch'inizi push'layın (`git push origin yeni-ozellik`).
5. Pull request oluşturun.

---

## Lisans

Bu proje MIT lisansı ile lisanslanmıştır.

---

Her türlü soru ve öneriniz için iletişime geçebilirsiniz!
