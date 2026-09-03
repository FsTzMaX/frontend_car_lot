import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../api';

const EMPTY_FORM = {
  vin: '',
  stockNumber: '',
  brandId: '',
  typeId: '',
  model: '',
  year: new Date().getFullYear(),
  condition: 'USED',
  transmission: 'AUTOMATIC',
  fuelType: 'GASOLINE',
  mileage: 0,
  color: '',
  price: '',
  cost: '',
  description: '',
};

export default function VehicleForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState([]); // solo al editar
  const [newImageUrl, setNewImageUrl] = useState('');
  const [status, setStatus] = useState(isEditing ? 'loading' : 'ready');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getBrands().then(setBrands).catch(() => {});
    api.getVehicleTypes().then(setTypes).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEditing) return;
    api
      .getVehicle(id)
      .then((v) => {
        setForm({
          vin: v.vin,
          stockNumber: v.stockNumber,
          brandId: v.brandId,
          typeId: v.typeId,
          model: v.model,
          year: v.year,
          condition: v.condition,
          transmission: v.transmission,
          fuelType: v.fuelType,
          mileage: v.mileage,
          color: v.color || '',
          price: v.price,
          cost: v.cost || '',
          description: v.description || '',
        });
        setImages(v.images || []);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [id, isEditing]);

  function set(key) {
    return (e) => setForm({ ...form, [key]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      brandId: Number(form.brandId),
      typeId: Number(form.typeId),
      year: Number(form.year),
      mileage: Number(form.mileage),
      price: Number(form.price),
      cost: form.cost ? Number(form.cost) : null,
    };

    try {
      if (isEditing) {
        await api.updateVehicle(id, payload);
        navigate('/admin/vehiculos');
      } else {
        const created = await api.createVehicle(payload);
        navigate(`/admin/vehiculos/${created.id}/editar`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddImage() {
    if (!newImageUrl.trim()) return;
    try {
      await api.addVehicleImages(id, [newImageUrl.trim()]);
      const updated = await api.getVehicle(id);
      setImages(updated.images || []);
      setNewImageUrl('');
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleRemoveImage(imageId) {
    try {
      await api.removeVehicleImage(id, imageId);
      setImages(images.filter((img) => img.id !== imageId));
    } catch (err) {
      alert(err.message);
    }
  }

  if (status === 'loading') return <p className="loading">Cargando vehículo…</p>;
  if (status === 'error') return <p className="error-state">No se pudo cargar el vehículo.</p>;

  return (
    <div>
      <Link to="/admin/vehiculos" className="detail__back">← Volver a vehículos</Link>
      <h1 className="admin-page__title">{isEditing ? 'Editar vehículo' : 'Dar de alta un auto'}</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form__grid">
          <div className="field">
            <label htmlFor="vin">VIN</label>
            <input id="vin" required value={form.vin} onChange={set('vin')} disabled={isEditing} />
          </div>
          <div className="field">
            <label htmlFor="stockNumber">Folio interno</label>
            <input id="stockNumber" required value={form.stockNumber} onChange={set('stockNumber')} disabled={isEditing} />
          </div>

          <div className="field">
            <label htmlFor="brandId">Marca</label>
            <select id="brandId" required value={form.brandId} onChange={set('brandId')}>
              <option value="">Selecciona…</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="typeId">Tipo</label>
            <select id="typeId" required value={form.typeId} onChange={set('typeId')}>
              <option value="">Selecciona…</option>
              {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div className="field">
            <label htmlFor="model">Modelo</label>
            <input id="model" required value={form.model} onChange={set('model')} placeholder="RAV4" />
          </div>
          <div className="field">
            <label htmlFor="year">Año</label>
            <input id="year" type="number" required value={form.year} onChange={set('year')} />
          </div>

          <div className="field">
            <label htmlFor="condition">Condición</label>
            <select id="condition" value={form.condition} onChange={set('condition')}>
              <option value="NEW">Nuevo</option>
              <option value="USED">Usado</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="transmission">Transmisión</label>
            <select id="transmission" value={form.transmission} onChange={set('transmission')}>
              <option value="AUTOMATIC">Automática</option>
              <option value="MANUAL">Manual</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="fuelType">Combustible</label>
            <select id="fuelType" value={form.fuelType} onChange={set('fuelType')}>
              <option value="GASOLINE">Gasolina</option>
              <option value="DIESEL">Diésel</option>
              <option value="HYBRID">Híbrido</option>
              <option value="ELECTRIC">Eléctrico</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="mileage">Kilometraje</label>
            <input id="mileage" type="number" min="0" value={form.mileage} onChange={set('mileage')} />
          </div>

          <div className="field">
            <label htmlFor="color">Color</label>
            <input id="color" value={form.color} onChange={set('color')} />
          </div>
          <div className="field">
            <label htmlFor="price">Precio de venta</label>
            <input id="price" type="number" min="0" required value={form.price} onChange={set('price')} />
          </div>

          <div className="field">
            <label htmlFor="cost">Costo de adquisición (interno)</label>
            <input id="cost" type="number" min="0" value={form.cost} onChange={set('cost')} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            rows={4}
            value={form.description}
            onChange={set('description')}
            placeholder="Detalles relevantes: historial de servicio, dueños anteriores, extras…"
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button className="cta-btn" type="submit" disabled={saving}>
          {saving ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear vehículo'}
        </button>
      </form>

      {isEditing && (
        <div className="admin-images">
          <h2 className="admin-page__title" style={{ fontSize: 22 }}>Fotos</h2>
          <div className="admin-images__add">
            <input
              type="text"
              placeholder="URL de la foto (https://...)"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
            <button type="button" className="filters__reset" onClick={handleAddImage}>Agregar foto</button>
          </div>

          <div className="admin-images__grid">
            {images.map((img) => (
              <div className="admin-images__item" key={img.id}>
                <img src={img.url} alt="" />
                <button type="button" onClick={() => handleRemoveImage(img.id)}>Quitar</button>
              </div>
            ))}
            {images.length === 0 && <p className="admin-table__muted">Sin fotos todavía.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
