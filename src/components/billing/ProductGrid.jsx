import ProductTile from './ProductTile'

export default function ProductGrid({ products, onSelect }) {
  if (products.length === 0) {
    return (
      <p className="text-center text-sm text-ledger py-12">
        No products match that search.
      </p>
    )
  }
  return (
    <div className="grid grid-cols-2 gap-3">
      {products.map((p) => (
        <ProductTile key={p.id} product={p} onSelect={onSelect} />
      ))}
    </div>
  )
}
