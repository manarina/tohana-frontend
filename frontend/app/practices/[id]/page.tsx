
'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

import { Layout } from '@/components/common/Layout';

import { useQuery, useMutation } from '@apollo/client/react';

import { GET_PRACTICE } from '@/lib/graphql/queries/practices.queries';
import { DELETE_PRACTICE } from '@/lib/graphql/mutations/practices.mutations';

import { PracticeForm } from '@/components/practices/PracticeForm';
import { PracticeDelete } from '@/components/practices/PracticeDelete';

import toast from 'react-hot-toast';

import {
  ArrowLeft,
  Edit2,
  Trash2,
  Loader2,
  Leaf,
  Calendar,
  MapPin,
  Building2,
  FileText,
  Sprout,
  CheckCircle,
} from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

interface PracticeData {
  id: number;

  practiceType: string;

  description?: string;

  startDate?: string;

  endDate?: string;

  status?: string;

  notes?: string;

  createdAt: string;

  updatedAt?: string;

  farm?: {
    id: number;
    name: string;
  };

  plot?: {
    id: number;
    name: string;
    cropType?: string;
    surface?: number;

    farm?: {
      id: number;
      name: string;
    };
  };
}

interface PracticeQueryData {
  practice: PracticeData;
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

export default function PracticeDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = parseInt(params.id as string, 10);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<PracticeQueryData>(GET_PRACTICE, {
    variables: { id },
    skip: !id,
  });

  const [deletePractice] = useMutation(DELETE_PRACTICE);

  const practice = data?.practice;

  // ============================================================
  // ACTIONS
  // ============================================================

  const handleBack = () => {
    router.push('/practices');
  };

  const handleDelete = async () => {
    try {
      await deletePractice({
        variables: {
          id,
        },
      });

      toast.success('Pratique supprimée avec succès !');

      router.push('/practices');
    } catch (error: any) {
      toast.error(
        error?.message || 'Erreur lors de la suppression',
      );
    }
  };

  const handleFormClose = async () => {
    setIsEditOpen(false);

    await refetch();
  };

  // ============================================================
  // HELPERS
  // ============================================================

  const formatDate = (date?: string) => {
    if (!date) {
      return 'Non spécifiée';
    }

    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusColor = (status?: string) => {
    const colors: Record<string, string> = {
      ACTIVE:
        'bg-green-100 text-green-800 border-green-200',

      COMPLETED:
        'bg-blue-100 text-blue-800 border-blue-200',

      PLANNED:
        'bg-yellow-100 text-yellow-800 border-yellow-200',

      CANCELLED:
        'bg-red-100 text-red-800 border-red-200',
    };

    return (
      colors[status || ''] ||
      'bg-gray-100 text-gray-800 border-gray-200'
    );
  };

  const getStatusLabel = (status?: string) => {
    const labels: Record<string, string> = {
      ACTIVE: 'Active',
      COMPLETED: 'Terminée',
      PLANNED: 'Planifiée',
      CANCELLED: 'Annulée',
    };

    return (
      labels[status || ''] ||
      status ||
      'Non spécifié'
    );
  };

  const getPracticeIcon = () => {
    return '🌱';
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto" />

            <p className="mt-4 text-gray-500">
              Chargement de la pratique...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error || !practice) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-medium">
            Erreur de chargement
          </h3>

          <p className="text-red-600 mt-1">
            {error?.message ||
              'Pratique non trouvée'}
          </p>

          <button
            onClick={handleBack}
            className="mt-4 btn-primary"
          >
            Retour à la liste
          </button>
        </div>
      </Layout>
    );
  }

  // ============================================================
  // RENDU
  // ============================================================

  return (
    <Layout>
      <div className="space-y-6">

        {/* ====================================================
            EN-TÊTE
        ==================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />

            Retour à la liste
          </button>

          <div className="flex items-center gap-2">

            <button
              onClick={() => setIsEditOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Edit2 className="h-4 w-4" />

              Modifier
            </button>

            <button
              onClick={() => setIsDeleteOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />

              Supprimer
            </button>

          </div>
        </div>

        {/* ====================================================
            INFORMATIONS PRINCIPALES
        ==================================================== */}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">

          {/* EN-TÊTE */}

          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">

            <div className="flex items-center gap-4">

              <div className="p-3 bg-white/20 rounded-xl text-4xl">
                {getPracticeIcon()}
              </div>

              <div>

                <h1 className="text-2xl font-bold text-white">
                  {practice.practiceType}
                </h1>

                <div className="flex flex-wrap items-center gap-2 mt-2">

                  {practice.status && (
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(
                        practice.status,
                      )}`}
                    >
                      {getStatusLabel(
                        practice.status,
                      )}
                    </span>
                  )}

                </div>

              </div>

            </div>

          </div>

          {/* CORPS */}

          <div className="p-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* TYPE DE PRATIQUE */}

              <div>

                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Type de pratique
                </h3>

                <div className="flex items-center gap-2">

                  <Leaf className="h-5 w-5 text-purple-500" />

                  <span className="text-lg font-semibold text-gray-900">
                    {practice.practiceType}
                  </span>

                </div>

              </div>

              {/* STATUT */}

              <div>

                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Statut
                </h3>

                <div className="flex items-center gap-2">

                  <CheckCircle className="h-5 w-5 text-green-500" />

                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                      practice.status,
                    )}`}
                  >
                    {getStatusLabel(
                      practice.status,
                    )}
                  </span>

                </div>

              </div>

              {/* DATE DE DÉBUT */}

              <div>

                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Date de début
                </h3>

                <div className="flex items-center gap-2">

                  <Calendar className="h-5 w-5 text-gray-400" />

                  <span className="text-gray-700">
                    {formatDate(
                      practice.startDate,
                    )}
                  </span>

                </div>

              </div>

              {/* DATE DE FIN */}

              <div>

                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Date de fin
                </h3>

                <div className="flex items-center gap-2">

                  <Calendar className="h-5 w-5 text-gray-400" />

                  <span className="text-gray-700">
                    {formatDate(
                      practice.endDate,
                    )}
                  </span>

                </div>

              </div>

              {/* PARCELLE */}

              {practice.plot && (
                <div className="col-span-full">

                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Parcelle
                  </h3>

                  <Link
                    href={`/plots/${practice.plot.id}`}
                    className="flex flex-wrap items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  >

                    <MapPin className="h-5 w-5" />

                    <span className="font-medium">
                      {practice.plot.name}
                    </span>

                    {practice.plot.cropType && (
                      <>
                        <span className="text-gray-400">
                          •
                        </span>

                        <span className="text-gray-600">
                          {practice.plot.cropType}
                        </span>
                      </>
                    )}

                    {practice.plot.surface !==
                      undefined && (
                      <>
                        <span className="text-gray-400">
                          •
                        </span>

                        <span className="text-gray-500">
                          {practice.plot.surface} ha
                        </span>
                      </>
                    )}

                  </Link>

                  {practice.plot.farm && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">

                      <Building2 className="h-4 w-4" />

                      <span>
                        Exploitation :{' '}
                        {practice.plot.farm.name}
                      </span>

                    </div>
                  )}

                </div>
              )}

              {/* EXPLOITATION */}

              {practice.farm && (
                <div className="col-span-full">

                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Exploitation
                  </h3>

                  <Link
                    href={`/farms/${practice.farm.id}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  >

                    <Building2 className="h-5 w-5" />

                    <span className="font-medium">
                      {practice.farm.name}
                    </span>

                  </Link>

                </div>
              )}

              {/* DESCRIPTION */}

              {practice.description && (
                <div className="col-span-full">

                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Description
                  </h3>

                  <div className="flex gap-2">

                    <FileText className="h-5 w-5 text-gray-400 mt-0.5" />

                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg flex-1">
                      {practice.description}
                    </p>

                  </div>

                </div>
              )}

              {/* NOTES */}

              {practice.notes && (
                <div className="col-span-full">

                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Notes
                  </h3>

                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {practice.notes}
                  </p>

                </div>
              )}

              {/* MÉTADONNÉES */}

              <div className="col-span-full pt-4 border-t border-gray-100">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-400">

                  <div>

                    <span className="font-medium text-gray-500">
                      Créé le :
                    </span>

                    <span className="ml-2">
                      {formatDate(
                        practice.createdAt,
                      )}
                    </span>

                  </div>

                  {practice.updatedAt && (
                    <div>

                      <span className="font-medium text-gray-500">
                        Modifié le :
                      </span>

                      <span className="ml-2">
                        {formatDate(
                          practice.updatedAt,
                        )}
                      </span>

                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ====================================================
            ACTIONS RAPIDES
        ==================================================== */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {practice.plot && (
            <Link
              href={`/plots/${practice.plot.id}`}
              className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow"
            >
              <MapPin className="h-6 w-6 text-green-500 mx-auto mb-2" />

              <p className="text-sm font-medium text-gray-700">
                Voir la parcelle
              </p>
            </Link>
          )}

          {(practice.farm ||
            practice.plot?.farm) && (
            <Link
              href={`/farms/${
                practice.farm?.id ||
                practice.plot?.farm?.id
              }`}
              className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow"
            >
              <Building2 className="h-6 w-6 text-blue-500 mx-auto mb-2" />

              <p className="text-sm font-medium text-gray-700">
                Voir l'exploitation
              </p>
            </Link>
          )}

          <button
            onClick={() => setIsEditOpen(true)}
            className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow"
          >
            <Edit2 className="h-6 w-6 text-purple-500 mx-auto mb-2" />

            <p className="text-sm font-medium text-gray-700">
              Modifier
            </p>
          </button>

          <button
            onClick={() => setIsDeleteOpen(true)}
            className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow"
          >
            <Trash2 className="h-6 w-6 text-red-500 mx-auto mb-2" />

            <p className="text-sm font-medium text-gray-700">
              Supprimer
            </p>
          </button>

        </div>

        {/* ====================================================
            MODAL MODIFICATION
        ==================================================== */}

        {isEditOpen && (
          <PracticeForm
            onClose={handleFormClose}
            initialData={practice}
            farms={
              practice.farm
                ? [practice.farm]
                : practice.plot?.farm
                  ? [practice.plot.farm]
                  : []
            }
            onSuccess={handleFormClose}
          />
        )}

        {/* ====================================================
            MODAL SUPPRESSION
        ==================================================== */}

        {isDeleteOpen && (
          <PracticeDelete
            practice={{
              id: practice.id,
              name: practice.practiceType,
            }}
            onConfirm={handleDelete}
            onCancel={() =>
              setIsDeleteOpen(false)
            }
          />
        )}

      </div>
    </Layout>
  );
}

