
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
  FileText,
  TrendingUp,
  GraduationCap,
  CheckCircle,
  Star,
  MessageSquare,
  Target,
  Sprout,
} from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

interface FarmData {
  id: number;
  name: string;
}

interface PracticeData {
  id: number;

  practiceType: string;

  specificTechnique?: string;

  surface?: number;

  adoptionDate?: string;

  description?: string;

  perceivedBenefit?: string;

  yieldImprovement?: number;

  sourceOfKnowledge?: string;

  isStillPracticed?: boolean;

  challenges?: string;

  satisfactionRating?: number;

  recommendation?: string;

  farmId?: number;

  farm?: FarmData;

  createdAt?: string;

  updatedAt?: string;
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
    skip: !id || Number.isNaN(id),
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

  const handleFormClose = () => {
    setIsEditOpen(false);
  };

  const handleFormSuccess = async () => {
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

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatPercentage = (value?: number) => {
    if (
      value === undefined ||
      value === null
    ) {
      return 'Non spécifiée';
    }

    return `${value}%`;
  };

  const formatRating = (value?: number) => {
    if (
      value === undefined ||
      value === null ||
      value === 0
    ) {
      return 'Non évaluée';
    }

    return `${value}/5`;
  };

  const formatEnum = (value?: string) => {
    if (!value) {
      return 'Non spécifié';
    }

    return value
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const getPracticeIcon = () => {
    return '🌱';
  };

  const getPracticeTypeLabel = (
    type?: string,
  ) => {
    if (!type) {
      return 'Pratique non spécifiée';
    }

    const labels: Record<string, string> = {
      CULTURE_DE_COUVERTURE:
        'Culture de couverture',
      AGROFORESTERIE: 'Agroforesterie',
      COMPOSTAGE: 'Compostage',
      MULCHING: 'Mulching',
      ZAI: 'Zaï',
      BANDES_ENHERBEES:
        'Bandes enherbées',
      IRRIGATION_ECONOMIE_EAU:
        "Irrigation économe en eau",
      AUTRE: 'Autre',
    };

    return labels[type] || formatEnum(type);
  };

  const getBenefitLabel = (
    benefit?: string,
  ) => {
    if (!benefit) {
      return 'Non spécifié';
    }

    const labels: Record<string, string> = {
      AMELIORATION_SOL:
        'Amélioration du sol',
      AUGMENTATION_RENDEMENT:
        'Augmentation du rendement',
      REDUCTION_EROSION:
        "Réduction de l'érosion",
      ECONOMIE_EAU:
        "Économie d'eau",
      REDUCTION_INTRANTS:
        'Réduction des intrants',
      DIVERSIFICATION_REVENUS:
        'Diversification des revenus',
      MEILLEURE_ADAPTATION:
        'Meilleure adaptation',
      AUTRE: 'Autre',
    };

    return labels[benefit] || formatEnum(benefit);
  };

  const getKnowledgeSourceLabel = (
    source?: string,
  ) => {
    if (!source) {
      return 'Non spécifiée';
    }

    const labels: Record<string, string> = {
      FORMATION_TOHATRA:
        'Formation TOHATRA',
      FORMATION_DEFIS:
        'Formation DEFIS',
      FORMATION_PRADA:
        'Formation PRADA',
      VULGARISATION:
        'Vulgarisation',
      ECHANGE_PAYSAN:
        'Échange entre paysans',
      AUTO_APPRENTISSAGE:
        'Auto-apprentissage',
      AUTRE: 'Autre',
    };

    return labels[source] || formatEnum(source);
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
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-red-800 font-medium text-lg">
            Erreur de chargement
          </h3>

          <p className="text-red-600 mt-2">
            {error?.message ||
              'Pratique non trouvée'}
          </p>

          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
              onClick={() =>
                setIsEditOpen(true)
              }
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Edit2 className="h-4 w-4" />

              Modifier
            </button>

            <button
              onClick={() =>
                setIsDeleteOpen(true)
              }
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

          {/* HEADER */}

          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">

            <div className="flex items-center gap-4">

              <div className="p-3 bg-white/20 rounded-xl text-4xl">
                {getPracticeIcon()}
              </div>

              <div>

                <h1 className="text-2xl font-bold text-white">
                  {getPracticeTypeLabel(
                    practice.practiceType,
                  )}
                </h1>

                {practice.specificTechnique && (
                  <p className="text-purple-100 mt-1">
                    {practice.specificTechnique}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 mt-3">

                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                    <Calendar className="h-3.5 w-3.5" />

                    Adoption :{' '}
                    {formatDate(
                      practice.adoptionDate,
                    )}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                      practice.isStillPracticed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <CheckCircle className="h-3.5 w-3.5" />

                    {practice.isStillPracticed
                      ? 'Toujours pratiquée'
                      : 'Plus pratiquée'}
                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* CORPS */}

          <div className="p-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* TYPE */}

              <div>

                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Type de pratique
                </h3>

                <div className="flex items-center gap-2">

                  <Leaf className="h-5 w-5 text-purple-500" />

                  <span className="text-lg font-semibold text-gray-900">
                    {getPracticeTypeLabel(
                      practice.practiceType,
                    )}
                  </span>

                </div>

              </div>

              {/* TECHNIQUE */}

              <div>

                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Technique spécifique
                </h3>

                <div className="flex items-center gap-2">

                  <Sprout className="h-5 w-5 text-green-500" />

                  <span className="text-gray-700">
                    {practice.specificTechnique ||
                      'Non spécifiée'}
                  </span>

                </div>

              </div>

              {/* SURFACE */}

              <div>

                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Surface concernée
                </h3>

                <div className="flex items-center gap-2">

                  <MapPin className="h-5 w-5 text-blue-500" />

                  <span className="text-lg font-semibold text-gray-900">
                    {practice.surface !==
                    undefined
                      ? `${practice.surface} ha`
                      : 'Non spécifiée'}
                  </span>

                </div>

              </div>

              {/* DATE D'ADOPTION */}

              <div>

                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Date d'adoption
                </h3>

                <div className="flex items-center gap-2">

                  <Calendar className="h-5 w-5 text-gray-400" />

                  <span className="text-gray-700">
                    {formatDate(
                      practice.adoptionDate,
                    )}
                  </span>

                </div>

              </div>

              {/* BÉNÉFICE */}

              <div>

                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Bénéfice perçu
                </h3>

                <div className="flex items-center gap-2">

                  <Target className="h-5 w-5 text-green-500" />

                  <span className="text-gray-700">
                    {getBenefitLabel(
                      practice.perceivedBenefit,
                    )}
                  </span>

                </div>

              </div>

              {/* RENDEMENT */}

              <div>

                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Amélioration du rendement
                </h3>

                <div className="flex items-center gap-2">

                  <TrendingUp className="h-5 w-5 text-green-600" />

                  <span className="text-lg font-semibold text-green-700">
                    {formatPercentage(
                      practice.yieldImprovement,
                    )}
                  </span>

                </div>

              </div>

              {/* SOURCE DE CONNAISSANCE */}

              <div>

                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Source de connaissance
                </h3>

                <div className="flex items-center gap-2">

                  <GraduationCap className="h-5 w-5 text-blue-500" />

                  <span className="text-gray-700">
                    {getKnowledgeSourceLabel(
                      practice.sourceOfKnowledge,
                    )}
                  </span>

                </div>

              </div>

              {/* SATISFACTION */}

              <div>

                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Niveau de satisfaction
                </h3>

                <div className="flex items-center gap-2">

                  <Star className="h-5 w-5 text-yellow-500" />

                  <span className="text-lg font-semibold text-gray-900">
                    {formatRating(
                      practice.satisfactionRating,
                    )}
                  </span>

                </div>

              </div>

              {/* EXPLOITATION */}

              {practice.farm && (
                <div className="col-span-full">

                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Exploitation
                  </h3>

                  <Link
                    href={`/farms/${practice.farm.id}`}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  >

                    <MapPin className="h-5 w-5" />

                    <span className="font-medium">
                      {practice.farm.name}
                    </span>

                  </Link>

                </div>
              )}

              {/* DESCRIPTION */}

              {practice.description && (
                <div className="col-span-full">

                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Description
                  </h3>

                  <div className="flex gap-3">

                    <FileText className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />

                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg flex-1 whitespace-pre-wrap">
                      {practice.description}
                    </p>

                  </div>

                </div>
              )}

              {/* DÉFIS */}

              {practice.challenges && (
                <div className="col-span-full">

                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Défis rencontrés
                  </h3>

                  <div className="flex gap-3">

                    <MessageSquare className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />

                    <p className="text-gray-700 bg-orange-50 border border-orange-100 p-4 rounded-lg flex-1 whitespace-pre-wrap">
                      {practice.challenges}
                    </p>

                  </div>

                </div>
              )}

              {/* RECOMMANDATION */}

              {practice.recommendation && (
                <div className="col-span-full">

                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Recommandation
                  </h3>

                  <div className="flex gap-3">

                    <FileText className="h-5 w-5 text-purple-500 mt-0.5 shrink-0" />

                    <p className="text-gray-700 bg-purple-50 border border-purple-100 p-4 rounded-lg flex-1 whitespace-pre-wrap">
                      {practice.recommendation}
                    </p>

                  </div>

                </div>
              )}

              {/* STATUT */}

              <div className="col-span-full">

                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  État de la pratique
                </h3>

                <div className="flex items-center gap-2">

                  <CheckCircle
                    className={`h-5 w-5 ${
                      practice.isStillPracticed
                        ? 'text-green-500'
                        : 'text-gray-400'
                    }`}
                  />

                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      practice.isStillPracticed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {practice.isStillPracticed
                      ? 'Toujours pratiquée'
                      : 'N’est plus pratiquée'}
                  </span>

                </div>

              </div>

              {/* MÉTADONNÉES */}

              {(practice.createdAt ||
                practice.updatedAt) && (
                <div className="col-span-full pt-4 border-t border-gray-100">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-400">

                    {practice.createdAt && (
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
                    )}

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
              )}

            </div>

          </div>

        </div>

        {/* ====================================================
            ACTIONS RAPIDES
        ==================================================== */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {practice.farm && (
            <Link
              href={`/farms/${practice.farm.id}`}
              className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow"
            >
              <MapPin className="h-6 w-6 text-blue-500 mx-auto mb-2" />

              <p className="text-sm font-medium text-gray-700">
                Voir l'exploitation
              </p>
            </Link>
          )}

          <button
            onClick={() =>
              setIsEditOpen(true)
            }
            className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow"
          >
            <Edit2 className="h-6 w-6 text-purple-500 mx-auto mb-2" />

            <p className="text-sm font-medium text-gray-700">
              Modifier
            </p>
          </button>

          <button
            onClick={() =>
              setIsDeleteOpen(true)
            }
            className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow"
          >
            <Trash2 className="h-6 w-6 text-red-500 mx-auto mb-2" />

            <p className="text-sm font-medium text-gray-700">
              Supprimer
            </p>
          </button>

          <button
            onClick={() => refetch()}
            className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow"
          >
            <Loader2 className="h-6 w-6 text-gray-500 mx-auto mb-2" />

            <p className="text-sm font-medium text-gray-700">
              Actualiser
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
                : []
            }
            onSuccess={handleFormSuccess}
          />
        )}

        {/* ====================================================
            MODAL SUPPRESSION
        ==================================================== */}

        {isDeleteOpen && (
          <PracticeDelete
            practice={{
              id: practice.id,
              name: getPracticeTypeLabel(
                practice.practiceType,
              ),
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

