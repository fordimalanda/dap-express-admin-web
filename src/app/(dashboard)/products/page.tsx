"use client";

import React, { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Copy, ExternalLink, Package, Check, Sparkles } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "prod-1",
      name: "Pack Écouteurs Pro Max Sans Fil",
      slug: "pack-ecouteurs-pro-max",
      description: "Qualité audio haute définition avec réduction de bruit active.",
      price: 24900,
      originalPrice: 45000,
      images: [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
      ],
      stock: 45,
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await apiClient.get("/products");
      if (res.data) setProducts(res.data);
    } catch (e) {
      console.warn("Utilisation de la liste des produits locale");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCopyLink = (productSlug: string) => {
    const storeBase = process.env.NEXT_PUBLIC_CLIENT_STORE_URL || "http://localhost:3001";
    const link = `${storeBase}/p/${productSlug}`;
    navigator.clipboard.writeText(link);
    setCopiedSlug(productSlug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const newProd = {
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      description,
      images: imageUrl ? [imageUrl] : ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80"],
      stock: 50,
      isAvailable: true,
    };

    try {
      const res = await apiClient.post("/products", newProd);
      setProducts([res.data, ...products]);
    } catch (e) {
      // Local optimistic fallback
      setProducts([
        {
          id: `prod-${Date.now()}`,
          ...newProd,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Product,
        ...products,
      ]);
    } finally {
      setIsSaving(false);
      setShowAddModal(false);
      setName("");
      setSlug("");
      setPrice("");
      setOriginalPrice("");
      setDescription("");
      setImageUrl("");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Catalogue Produits & Liens Directs</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Gérez vos offres et copiez directement les liens exacts de vos pages produits pour vos annonces
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} size="md" className="gap-2 font-bold shadow-sm">
          <Plus className="h-4 w-4" />
          Ajouter un Produit
        </Button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
            <div className="relative aspect-video w-full bg-slate-100">
              <img
                src={p.images[0] || "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80"}
                alt={p.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                Stock: {p.stock}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-snug">{p.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{p.description}</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-xl font-black text-[#FF6B00]">{formatPrice(p.price)}</span>
                  {p.originalPrice && (
                    <span className="text-xs text-slate-400 line-through font-semibold">
                      {formatPrice(p.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Product Direct Link */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Lien de la page produit
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyLink(p.slug)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
                  >
                    {copiedSlug === p.slug ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" /> Lien copié !
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copier le lien
                      </>
                    )}
                  </button>
                  <a
                    href={`${process.env.NEXT_PUBLIC_CLIENT_STORE_URL || "http://localhost:3001"}/p/${p.slug}#order`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Ouvrir la page produit"
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl">
            <h2 className="text-xl font-black text-slate-900 mb-4">Ajouter un Nouveau Produit</h2>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <Input
                label="Nom du Produit"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Montre Connectée Ultra Series 9"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Prix de Vente (CFA)"
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="24900"
                />
                <Input
                  label="Prix Barré Promo (CFA)"
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="45000"
                />
              </div>
              <Input
                label="URL de l'image (ou Cloudflare R2)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1 block">
                  Description Commerciale
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-[#FF6B00] focus:outline-none"
                  placeholder="Points forts, bénéfices client..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" isLoading={isSaving}>
                  Enregistrer le Produit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
