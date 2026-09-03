export default function FilterBar({ filters, onChange, onReset, brands, types }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="filters">
      <p className="filters__label">Filtrar inventario</p>
      <div className="filters__grid">
        <div className="field">
          <label htmlFor="search">Buscar</label>
          <input
            id="search"
            type="text"
            placeholder="Modelo, VIN o folio..."
            value={filters.search}
            onChange={set('search')}
          />
        </div>

        <div className="field">
          <label htmlFor="brandId">Marca</label>
          <select id="brandId" value={filters.brandId} onChange={set('brandId')}>
            <option value="">Todas</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="typeId">Tipo</label>
          <select id="typeId" value={filters.typeId} onChange={set('typeId')}>
            <option value="">Todos</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="condition">Condición</label>
          <select id="condition" value={filters.condition} onChange={set('condition')}>
            <option value="">Cualquiera</option>
            <option value="NEW">Nuevo</option>
            <option value="USED">Usado</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="maxPrice">Precio máx.</label>
          <input
            id="maxPrice"
            type="number"
            placeholder="Sin límite"
            value={filters.maxPrice}
            onChange={set('maxPrice')}
          />
        </div>

        <button className="filters__reset" onClick={onReset} type="button">
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}
