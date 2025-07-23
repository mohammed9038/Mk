async function submitData() {
  const btn = document.getElementById('submit');
  if (btn) btn.disabled = true;

  const t = translations[currentLang];
  const clsMap = Object.fromEntries(
    translations.en.options.classification.map((eng, i) => [eng, t.options.classification[i]])
  );
  const visMap = Object.fromEntries(
    translations.en.options.visibility.map((eng, i) => [eng, t.options.visibility[i]])
  );

  const address = document.getElementById('address').value.trim();
  const date = document.getElementById('date').value;
  const salesRep = document.getElementById('salesRep').value;
  const entriesEl = document.getElementById('entries');

  const formData = new FormData();

  const entries = Array.from(entriesEl.children).map((entry, index) => {
    const files = entry.querySelector('input[name="images"]').files;
    Array.from(files).forEach((file, i) => {
      // Attach each file to FormData
      formData.append(`image_${index}_${i}`, file);
    });

    return {
      classification: clsMap[entry.querySelector('select[name="classification"]').value] || '',
      supplier: entry.querySelector('select[name="supplier"]').value,
      brand: entry.querySelector('select[name="brand"]').value,
      compBrand: entry.querySelector('select[name="compBrand"]').value,
      productName: entry.querySelector('input[name="productName"]').value,
      productSize: entry.querySelector('input[name="productSize"]').value,
      actCat: entry.querySelector('select[name="actCat"]').value,
      activity: entry.querySelector('select[name="activity"]').value,
      price: entry.querySelector('input[name="price"]').value,
      promo: entry.querySelector('input[name="promo"]').value,
      visibility: visMap[entry.querySelector('select[name="visibility"]').value] || '',
      facing: entry.querySelector('input[name="facing"]').value,
      compFacing: entry.querySelector('input[name="compFacing"]').value,
      imageCount: files.length,
    };
  });

  const payload = { address, date, salesRep, entries };
  formData.append('data', JSON.stringify(payload));

  try {
    const res = await fetch('https://script.google.com/macros/s/AKfycbzfSWHROQG2Hx_FJtEMvnHtFgMjV8CG6ZfE5hUJ7e8HqJEOHDCzGlZ-i8Pauaj1yN7c/exec', {
      method: 'POST',
      body: formData,
    });

    const text = await res.text();
    if (!res.ok) throw new Error(text);
    alert('Submitted successfully');
  } catch (err) {
    console.error(err);
    alert('Submission failed');
  } finally {
    if (btn) btn.disabled = false;
  }
}

document.getElementById('submit').addEventListener('click', submitData);
