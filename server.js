require('dotenv').config(); // Загружаем переменные окружения
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 6300;
const FILE_PATH = 'products.json'; // Путь к JSON-файлу

app.use(cors());
app.use(express.json());

// Функция для получения товаров из Bitrix24
async function fetchProducts() {
    console.log('Запрос к Bitrix24 API...');
    const productSelects = ["ACTIVE", "CATALOG_ID", "CODE", "CREATED_BY", "CURRENCY_ID", "DATE_CREATE", "DESCRIPTION", "DESCRIPTION_TYPE", "DETAIL_PICTURE", "ID", "MEASURE", "MODIFIED_BY", "NAME", "PREVIEW_PICTURE", "PRICE", "PROPERTY_44", "PROPERTY_50", "PROPERTY_52", "PROPERTY_54", "PROPERTY_56", "PROPERTY_58", "PROPERTY_60", "PROPERTY_62", "PROPERTY_64", "PROPERTY_66", "PROPERTY_68", "PROPERTY_70", "PROPERTY_72", "PROPERTY_74", "PROPERTY_76", "PROPERTY_78", "PROPERTY_80", "PROPERTY_82", "PROPERTY_84", "PROPERTY_86", "PROPERTY_88", "SECTION_ID", "SORT", "TIMESTAMP_X", "VAT_ID", "VAT_INCLUDED", "XML_ID"];
    const allProducts = [];
    let start = 0;
    let total = 0;
  
    try {
      do {
        const response = await axios.get(`https://b24-8cgsys.bitrix24.kz/rest${process.env.BITRIX_API_KEY}crm.product.list`, {
          params: {
            filter: { iblockId: 16 },
            select: productSelects,
            start: start,
          },
        });
  
        total = response.data.total;
        start += 50;
  
        console.log('Ответ от Bitrix24:', response.data);
  
        if (!response.data.result || response.data.result.length === 0) {
          console.warn('Bitrix24 вернул пустой список товаров!');
          break;
        }
  
        allProducts.push(...response.data.result);
  
        if (response.data.total < 50) {
          break;
        }
      } while (start < total);
      
      console.log(allProducts.length);

      fs.writeFileSync(FILE_PATH, '', 'utf-8');

      // Записываем товары в файл
      fs.writeFileSync(FILE_PATH, JSON.stringify(allProducts, null, 2), 'utf-8');
      console.log(`✅ Товары успешно записаны в ${FILE_PATH}`);
      return allProducts;
    } catch (error) {
      console.error('Ошибка при запросе к Bitrix24:', error);
      return [];
    }
  }
// '/qareket/api/update-products'
// НОВЫЙ маршрут: обновить JSON-файл вручную
app.post('/qareket/api/update-products', async (req, res) => {
  console.log('⏳ Обновляем products.json...');
  const products = await fetchProducts();
  if (products.length > 0) {
    res.json({ message: 'Товары обновлены', count: products.length });
  } else {
    res.status(500).json({ error: 'Ошибка при получении товаров' });
  }
});

// НОВЫЙ маршрут: получить данные из JSON-файла
// '/qareket/api/products'
app.post('/qareket/api/products', (req, res) => {
  console.log('📂 Запрос к локальному JSON...');
  if (!fs.existsSync(FILE_PATH)) {
    return res.status(404).json({ error: 'Файл products.json не найден' });
  }

  try {
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    const products = JSON.parse(data);
    // const products = data;


    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.json({ products });
  } catch (error) {
    console.error('Ошибка чтения JSON:', error);
    res.status(500).json({ error: 'Ошибка чтения файла' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});