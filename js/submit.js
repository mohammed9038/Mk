async function uploadAndSubmit() {
  const btn = document.getElementById('submit');
  btn.disabled = true;

  const address = document.getElementById('address').value.trim();
  const date = document.getElementById('date').value;
  const salesRep = document.getElementById('salesRep').value;
  const entriesEl = document.getElementById('entries');

  const formData = new FormData();

  const entries = Array.from(entriesEl.children).map((entry, idx) => {
    const files = entry.querySelector('input[name="images"]').files;
    for (let i = 0; i < files.length; i++) {
      formData.append(`image_${idx}_${i}`, files[i]);
    }

    return {
      classification: entry.querySelector('select[name="classification"]').value,
      supplier: entry.querySelector('select[name="supplier"]').value,
      brand: entry.querySelector('select[name="brand"]').value,
      compBrand: entry.querySelector('select[name="compBrand"]').value,
      productName: entry.querySelector('input[name="productName"]').value,
      productSize: entry.querySelector('input[name="productSize"]').value,
      actCat: entry.querySelector('select[name="actCat"]').value,
      activity: entry.querySelector('select[name="activity"]').value,
      price: entry.querySelector('input[name="price"]').value,
      promo: entry.querySelector('input[name="promo"]').value,
      visibility: entry.querySelector('select[name="visibility"]').value,
      facing: entry.querySelector('input[name="facing"]').value,
      compFacing: entry.querySelector('input[name="compFacing"]').value,
      imageCount: files.length
    };
  });

  const payload = { address, date, salesRep, entries };
  formData.append('data', JSON.stringify(payload));

  try {
    const res = await fetch('https://script.google.com/macros/s/AKfycbzfSWHROQG2Hx_FJtEMvnHtFgMjV8CG6ZfE5hUJ7e8HqJEOHDCzGlZ-i8Pauaj1yN7c/exec', {
      method: 'POST',
      body: formData
    });

    const text = await res.text();
    if (!res.ok) throw new Error(text);
    alert('Submitted successfully!');
  } catch (err) {
    console.error(err);
    alert('Submission failed.');
  } finally {
    btn.disabled = false;
  }
}

document.getElementById('submit').addEventListener('click', uploadAndSubmit);
