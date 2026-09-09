
// components/plots/PlotList.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Plus,
  Search,
  Filter,
  Grid3x3,
  LayoutList,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { PlotCard } from './PlotCard';
import { useEffect, useState } from 'react';

interface PlotListProps {
  plots: any[];
  loading?: boolean;
  error?: any;
  onEdit: (plot: any) => void;
  onDelete: (id: number) => void;
  onView: (plot: any) => void;
  onAdd: () => void;
  onRefresh: () => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
}

export function PlotList({
  plots = [],
  loading = false,
  error = null,
  onEdit,
  onDelete,
  onView,
  onAdd,
  onRefresh,
  searchTerm = '',
  onSearchChange,
}: PlotListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Pagination pour la vue GRID
  const [gridPage, setGridPage] = useState(1);

  // Pagination pour la vue TABLE
  const [tablePage, setTablePage] = useState(1);

  // Nombre d'éléments par page
  const GRID_ITEMS_PER_PAGE = 4;
  const TABLE_ITEMS_PER_PAGE = 3;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  /*
   * ==========================================
   * PAGINATION GRID
   * 4 CARDS PAR PAGE
   * ==========================================
   */

  const gridTotalPages = Math.max(
    1,
    Math.ceil(plots.length / GRID_ITEMS_PER_PAGE)
  );

  const gridStartIndex =
    (gridPage - 1) * GRID_ITEMS_PER_PAGE;

  const gridEndIndex =
    gridStartIndex + GRID_ITEMS_PER_PAGE;

  const paginatedGridPlots = plots.slice(
    gridStartIndex,
    gridEndIndex
  );

  /*
   * ==========================================
   * PAGINATION TABLE
   * 3 LIGNES PAR PAGE
   * ==========================================
   */

  const tableTotalPages = Math.max(
    1,
    Math.ceil(plots.length / TABLE_ITEMS_PER_PAGE)
  );

  const tableStartIndex =
    (tablePage - 1) * TABLE_ITEMS_PER_PAGE;

  const tableEndIndex =
    tableStartIndex + TABLE_ITEMS_PER_PAGE;

  const paginatedTablePlots = plots.slice(
    tableStartIndex,
    tableEndIndex
  );

  /*
   * ==========================================
   * RESET PAGINATION
   * ==========================================
   *
   * Lorsqu'une recherche ou les données changent,
   * on revient automatiquement à la première page.
   */

  useEffect(() => {
    setGridPage(1);
    setTablePage(1);
  }, [plots.length, searchTerm]);

  /*
   * ==========================================
   * SÉCURITÉ APRÈS SUPPRESSION
   * ==========================================
   *
   * Si la dernière page devient invalide,
   * on revient à la dernière page disponible.
   */

  useEffect(() => {
    if (gridPage > gridTotalPages) {
      setGridPage(gridTotalPages);
    }
  }, [gridPage, gridTotalPages]);

  useEffect(() => {
    if (tablePage > tableTotalPages) {
      setTablePage(tableTotalPages);
    }
  }, [tablePage, tableTotalPages]);

  /*
   * ==========================================
   * LOADING
   * ==========================================
   */

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent mx-auto" />

          <p className="mt-4 text-gray-500">
            Chargement des parcelles...
          </p>
        </div>
      </div>
    );
  }

  /*
   * ==========================================
   * ERROR
   * ==========================================
   */

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-medium">
          Erreur de chargement
        </h3>

        <p className="text-red-600 mt-1">
          {error.message}
        </p>

        <button
          onClick={onRefresh}
          className="mt-4 btn-primary"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* ==========================================
          BARRE D'OUTILS
          ========================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        <div className="flex items-center gap-3 flex-1">

          {/* Recherche */}

          <div className="relative flex-1 max-w-md">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                onSearchChange?.(e.target.value)
              }
              placeholder="Rechercher une parcelle..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            />

          </div>

          {/* Filtres */}

          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4 text-gray-500" />

            <span className="text-sm text-gray-600">
              Filtres
            </span>
          </button>

        </div>

        <div className="flex items-center gap-2">

          {/* Vue Grid / Liste */}

          <div className="flex bg-gray-100 rounded-lg p-1">

            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Vue en grille"
            >
              <Grid3x3 className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Vue en liste"
            >
              <LayoutList className="h-4 w-4" />
            </button>

          </div>

          {/* Nouvelle parcelle */}

          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
          >
            <Plus className="h-4 w-4" />

            Nouvelle
          </button>

        </div>

      </div>

      {/* ==========================================
          LISTE DES PARCELLES
          ========================================== */}

      <AnimatePresence mode="wait">

        {plots.length === 0 ? (

          /*
           * ==========================================
           * AUCUNE PARCELLE
           * ==========================================
           */

          <div className="text-center py-12 bg-white rounded-xl shadow-md">

            <MapPin className="h-16 w-16 mx-auto text-gray-300 mb-4" />

            <h3 className="text-lg font-medium text-gray-900">
              Aucune parcelle
            </h3>

            <p className="text-gray-500 mt-1">
              Commencez par créer votre première parcelle
            </p>

            <button
              type="button"
              onClick={onAdd}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Créer une parcelle
            </button>

          </div>

        ) : viewMode === 'grid' ? (

          /*
           * ==========================================
           * VUE GRID
           * 4 CARDS PAR PAGE
           * ==========================================
           */

          <div className="space-y-5">

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >

              {paginatedGridPlots.map((plot, index) => (

                <PlotCard
                  key={plot.id}
                  plot={plot}
                  index={index}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                />

              ))}

            </motion.div>

            {/* ==========================================
                PAGINATION GRID
                ========================================== */}

            {gridTotalPages > 1 && (

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3">

                {/* Informations */}

                <p className="text-sm text-gray-500">

                  Affichage de{' '}

                  <span className="font-medium text-gray-700">
                    {gridStartIndex + 1}
                  </span>

                  {' '}à{' '}

                  <span className="font-medium text-gray-700">
                    {Math.min(
                      gridEndIndex,
                      plots.length
                    )}
                  </span>

                  {' '}sur{' '}

                  <span className="font-medium text-gray-700">
                    {plots.length}
                  </span>

                  {' '}parcelles

                </p>

                {/* Navigation */}

                <div className="flex items-center gap-2">

                  {/* Précédent */}

                  <button
                    type="button"
                    onClick={() =>
                      setGridPage((prev) =>
                        Math.max(prev - 1, 1)
                      )
                    }
                    disabled={gridPage === 1}
                    className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />

                    Précédent
                  </button>

                  {/* Numéros */}

                  <div className="flex items-center gap-1">

                    {Array.from(
                      { length: gridTotalPages },
                      (_, index) => index + 1
                    ).map((page) => (

                      <button
                        type="button"
                        key={page}
                        onClick={() =>
                          setGridPage(page)
                        }
                        className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-colors ${
                          gridPage === page
                            ? 'bg-green-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>

                    ))}

                  </div>

                  {/* Suivant */}

                  <button
                    type="button"
                    onClick={() =>
                      setGridPage((prev) =>
                        Math.min(
                          prev + 1,
                          gridTotalPages
                        )
                      )
                    }
                    disabled={
                      gridPage === gridTotalPages
                    }
                    className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Suivant

                    <ChevronRight className="h-4 w-4" />
                  </button>

                </div>

              </div>

            )}

          </div>

        ) : (

          /*
           * ==========================================
           * VUE TABLE
           * 3 LIGNES PAR PAGE
           * ==========================================
           */

          <div className="space-y-5">

            <div className="bg-white rounded-xl shadow-md overflow-hidden">

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-gray-50 border-b border-gray-100">

                    <tr>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Culture
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Surface
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exploitation
                      </th>

                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-gray-100">

                    {paginatedTablePlots.map((plot) => (

                      <tr
                        key={plot.id}
                        className="hover:bg-gray-50 transition-colors"
                      >

                        <td className="px-6 py-4">

                          <div>

                            <p className="font-medium text-gray-900">
                              {plot.name}
                            </p>

                            {plot.cropVariety && (
                              <p className="text-xs text-gray-400">
                                {plot.cropVariety}
                              </p>
                            )}

                          </div>

                        </td>

                        <td className="px-6 py-4">

                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {plot.cropType}
                          </span>

                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {plot.surface} ha
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {plot.farm?.name || 'N/A'}
                        </td>

                        <td className="px-6 py-4 text-right">

                          <div className="flex items-center justify-end gap-1">

                            <button
                              type="button"
                              onClick={() => onView(plot)}
                              className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                              title="Voir"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => onEdit(plot)}
                              className="p-2 hover:bg-green-50 rounded-lg text-green-600"
                              title="Modifier"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => onDelete(plot.id)}
                              className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

            {/* ==========================================
                PAGINATION TABLE
                ========================================== */}

            {tableTotalPages > 1 && (

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3">

                {/* Informations */}

                <p className="text-sm text-gray-500">

                  Affichage de{' '}

                  <span className="font-medium text-gray-700">
                    {tableStartIndex + 1}
                  </span>

                  {' '}à{' '}

                  <span className="font-medium text-gray-700">
                    {Math.min(
                      tableEndIndex,
                      plots.length
                    )}
                  </span>

                  {' '}sur{' '}

                  <span className="font-medium text-gray-700">
                    {plots.length}
                  </span>

                  {' '}parcelles

                </p>

                {/* Navigation */}

                <div className="flex items-center gap-2">

                  {/* Précédent */}

                  <button
                    type="button"
                    onClick={() =>
                      setTablePage((prev) =>
                        Math.max(prev - 1, 1)
                      )
                    }
                    disabled={tablePage === 1}
                    className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />

                    Précédent
                  </button>

                  {/* Numéros */}

                  <div className="flex items-center gap-1">

                    {Array.from(
                      { length: tableTotalPages },
                      (_, index) => index + 1
                    ).map((page) => (

                      <button
                        type="button"
                        key={page}
                        onClick={() =>
                          setTablePage(page)
                        }
                        className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-colors ${
                          tablePage === page
                            ? 'bg-green-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>

                    ))}

                  </div>

                  {/* Suivant */}

                  <button
                    type="button"
                    onClick={() =>
                      setTablePage((prev) =>
                        Math.min(
                          prev + 1,
                          tableTotalPages
                        )
                      )
                    }
                    disabled={
                      tablePage === tableTotalPages
                    }
                    className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Suivant

                    <ChevronRight className="h-4 w-4" />
                  </button>

                </div>

              </div>

            )}

          </div>

        )}

      </AnimatePresence>

    </div>
  );
}

