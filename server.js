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
    const allProducts = [];
    let start = 0;
    let total = 0;
  
    try {
      do {
        const response = await axios.get(`https://b24-mrp6op.bitrix24.kz/rest/${process.env.BITRIX_API_KEY}/crm.product.list`, {
          params: {
            filter: { iblockId: 17 },
            select: [
              "ACTIVE",
              "CATALOG_ID",
              "CODE",
              "CREATED_BY",
              "CURRENCY_ID",
              "DESCRIPTION",
              "DESCRIPTION_TYPE",
              "DETAIL_PICTURE",
              "ID",
              "MEASURE",
              "MODIFIED_BY",
              "NAME",
              "PREVIEW_PICTURE",
              "PRICE",
              "PROPERTY_45",
              "PROPERTY_107",
              "PROPERTY_109",
              "PROPERTY_111",
              "PROPERTY_113",
              "PROPERTY_115",
              "PROPERTY_117",
              "PROPERTY_119",
              "PROPERTY_123",
              "PROPERTY_125",
              "PROPERTY_127",
              "PROPERTY_129",
              "PROPERTY_131",
              "PROPERTY_133",
              "PROPERTY_135",
              "PROPERTY_137",
              "PROPERTY_139",
              "PROPERTY_141",
              "PROPERTY_143",
              "PROPERTY_145",
              "PROPERTY_147",
              "SECTION_ID",
              "SORT",
              "TIMESTAMP_X",
              "VAT_ID",
              "VAT_INCLUDED",
              "XML_ID",
            ],
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

// НОВЫЙ маршрут: обновить JSON-файл вручную
app.post('/api/update-products', async (req, res) => {
  console.log('⏳ Обновляем products.json...');
  const products = await fetchProducts();
  if (products.length > 0) {
    res.json({ message: 'Товары обновлены', count: products.length });
  } else {
    res.status(500).json({ error: 'Ошибка при получении товаров' });
  }
});

// НОВЫЙ маршрут: получить данные из JSON-файла
app.post('/api/products', (req, res) => {
  console.log('📂 Запрос к локальному JSON...');
  if (!fs.existsSync(FILE_PATH)) {
    return res.status(404).json({ error: 'Файл products.json не найден' });
  }

  try {
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    const products = JSON.parse(data);

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
