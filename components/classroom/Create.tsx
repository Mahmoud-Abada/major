"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Copy,
  MapPin,
  MessageSquare,
  Monitor,
  Plus,
  Save,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

// Mock data and constants
const SCHOOL_YEARS = [
  { value: "1as", label: "1ère AS" },
  { value: "2as", label: "2ème AS" },
  { value: "3as", label: "3ème AS" },
  { value: "terminale", label: "Terminale" },
];

const SPECIALITIES = [
  { value: "sciences", label: "Sciences Exactes" },
  { value: "lettres", label: "Lettres et Langues" },
  { value: "gestion", label: "Gestion et Économie" },
  { value: "technique", label: "Techniques Mathématiques" },
];

const SUBJECTS = [
  { value: "maths", label: "Mathématiques" },
  { value: "physics", label: "Physique" },
  { value: "chemistry", label: "Chimie" },
  { value: "biology", label: "Sciences Naturelles" },
  { value: "french", label: "Français" },
  { value: "arabic", label: "Arabe" },
  { value: "english", label: "Anglais" },
  { value: "philosophy", label: "Philosophie" },
];

const TEACHERS = [
  { value: "teacher1", label: "Prof. Ahmed Benali" },
  { value: "teacher2", label: "Prof. Fatima Zohra" },
  { value: "teacher3", label: "Prof. Mohamed Cherif" },
  { value: "teacher4", label: "Prof. Aicha Mansouri" },
];

const DAYS_OF_WEEK = [
  { value: "monday", label: "Lundi" },
  { value: "tuesday", label: "Mardi" },
  { value: "wednesday", label: "Mercredi" },
  { value: "thursday", label: "Jeudi" },
  { value: "friday", label: "Vendredi" },
  { value: "saturday", label: "Samedi" },
  { value: "sunday", label: "Dimanche" },
];

const CURRENCIES = [
  { value: "dzd", label: "DZD" },
  { value: "eur", label: "EUR" },
  { value: "usd", label: "USD" },
];

// Weekly Schedule Component
const WeeklySchedule = ({ sessions, onSessionsChange }) => {
  const addSession = () => {
    const newSession = {
      id: Date.now(),
      day: "",
      startTime: "",
      endTime: "",
      type: "on-site",
    };
    onSessionsChange([...sessions, newSession]);
  };

  const removeSession = (id) => {
    onSessionsChange(sessions.filter((session) => session.id !== id));
  };

  const updateSession = (id, field, value) => {
    onSessionsChange(
      sessions.map((session) =>
        session.id === id ? { ...session, [field]: value } : session,
      ),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Emploi du temps hebdomadaire</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSession}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter une séance
        </Button>
      </div>

      <AnimatePresence>
        {sessions.map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium">Jour</label>
                    <Select
                      value={session.day}
                      onValueChange={(value) =>
                        updateSession(session.id, "day", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS_OF_WEEK.map((day) => (
                          <SelectItem key={day.value} value={day.value}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Heure de début
                    </label>
                    <Input
                      type="time"
                      value={session.startTime}
                      onChange={(e) =>
                        updateSession(session.id, "startTime", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Heure de fin</label>
                    <Input
                      type="time"
                      value={session.endTime}
                      onChange={(e) =>
                        updateSession(session.id, "endTime", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <Select
                      value={session.type}
                      onValueChange={(value) =>
                        updateSession(session.id, "type", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on-site">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Présentiel
                          </div>
                        </SelectItem>
                        <SelectItem value="online">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4" />
                            En ligne
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSession(session.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {sessions.length === 0 && (
        <Card className="p-8 text-center border-dashed">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Aucune séance programmée</p>
          <p className="text-sm text-gray-400">
            Cliquez sur "Ajouter une séance" pour commencer
          </p>
        </Card>
      )}
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ formData, sessions }) => {
  const getTotalHours = () => {
    return sessions.reduce((total, session) => {
      if (session.startTime && session.endTime) {
        const start = new Date(`2000-01-01T${session.startTime}`);
        const end = new Date(`2000-01-01T${session.endTime}`);
        return total + (end - start) / (1000 * 60 * 60);
      }
      return total;
    }, 0);
  };

  const getSessionTypes = () => {
    const types = sessions.reduce((acc, session) => {
      acc[session.type] = (acc[session.type] || 0) + 1;
      return acc;
    }, {});
    return types;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Aperçu de la classe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-2xl">
              {formData.name || "Nom de la classe"}
            </h4>
            <p className="text-sm text-gray-600">
              {formData.schoolYear &&
                SCHOOL_YEARS.find((y) => y.value === formData.schoolYear)
                  ?.label}
              {formData.speciality &&
                ` • ${SPECIALITIES.find((s) => s.value === formData.speciality)?.label}`}
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Matière</span>
              <Badge variant="secondary">
                {formData.subject
                  ? SUBJECTS.find((s) => s.value === formData.subject)?.label
                  : "Non définie"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Professeur</span>
              <span className="text-sm text-gray-600">
                {formData.teacher
                  ? TEACHERS.find((t) => t.value === formData.teacher)?.label
                  : "Non assigné"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Séances/semaine</span>
              <span className="text-sm font-semibold">{sessions.length}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Heures/semaine</span>
              <span className="text-sm font-semibold">
                {getTotalHours().toFixed(1)}h
              </span>
            </div>

            {Object.entries(getSessionTypes()).length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-medium">Types de séances</span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(getSessionTypes()).map(([type, count]) => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type === "on-site" ? (
                        <>
                          <MapPin className="h-3 w-3 mr-1" />
                          Présentiel: {count}
                        </>
                      ) : (
                        <>
                          <Monitor className="h-3 w-3 mr-1" />
                          En ligne: {count}
                        </>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Type de paiement</span>
              <Badge
                variant={
                  formData.paymentType === "monthly" ? "default" : "secondary"
                }
              >
                {formData.paymentType === "monthly" ? "Mensuel" : "Par séance"}
              </Badge>
            </div>

            {formData.paymentType === "monthly" && formData.monthlyPrice && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Prix mensuel</span>
                <span className="text-sm font-semibold">
                  {formData.monthlyPrice}{" "}
                  {formData.currency?.toUpperCase() || "DZD"}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Main Class Form Component
const ClassForm = ({ initialData = null, onSubmit }) => {
  const [sessions, setSessions] = useState(initialData?.sessions || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: initialData?.name || "",
      schoolYear: initialData?.schoolYear || "",
      speciality: initialData?.speciality || "",
      subject: initialData?.subject || "",
      description: initialData?.description || "",
      teacher: initialData?.teacher || "",
      paymentType: initialData?.paymentType || "monthly",
      monthlyPrice: initialData?.monthlyPrice || "",
      currency: initialData?.currency || "dzd",
    },
  });

  const watchedValues = form.watch();

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        sessions,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDuplicate = () => {
    // Logic for duplicating from another class
    console.log("Duplicate from another class");
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Form */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {initialData
                  ? "Modifier la classe"
                  : "Créer une nouvelle classe"}
              </h1>
              <p className="text-gray-600">
                Configurez les détails de base et l'emploi du temps
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                Dupliquer
              </Button>
            </div>
          </div>

          <Form {...form}>
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations de base</CardTitle>
                  <CardDescription>
                    Définissez les détails principaux de la classe
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom de la classe *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ex: 3AS Maths Groupe A"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="schoolYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Année d'étude *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner l'année" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SCHOOL_YEARS.map((year) => (
                                <SelectItem key={year.value} value={year.value}>
                                  {year.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="speciality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Spécialité *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner la spécialité" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SPECIALITIES.map((speciality) => (
                                <SelectItem
                                  key={speciality.value}
                                  value={speciality.value}
                                >
                                  {speciality.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Matière *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner la matière" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SUBJECTS.map((subject) => (
                                <SelectItem
                                  key={subject.value}
                                  value={subject.value}
                                >
                                  {subject.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description interne (optionnel)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Notes internes, objectifs particuliers..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Teacher Assignment */}
              <Card>
                <CardHeader>
                  <CardTitle>Affectation du professeur</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="teacher"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professeur assigné *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un professeur" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TEACHERS.map((teacher) => (
                              <SelectItem
                                key={teacher.value}
                                value={teacher.value}
                              >
                                {teacher.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Weekly Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle>Emploi du temps</CardTitle>
                  <CardDescription>
                    Configurez les séances hebdomadaires de la classe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <WeeklySchedule
                    sessions={sessions}
                    onSessionsChange={setSessions}
                  />
                </CardContent>
              </Card>

              {/* Payment Setup */}
              <Card>
                <CardHeader>
                  <CardTitle>Configuration des paiements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="paymentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de paiement</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="monthly">Mensuel</SelectItem>
                            <SelectItem value="per-session">
                              Par séance
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchedValues.paymentType === "monthly" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <FormField
                        control={form.control}
                        name="monthlyPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prix mensuel</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Devise</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CURRENCIES.map((currency) => (
                                  <SelectItem
                                    key={currency.value}
                                    value={currency.value}
                                  >
                                    {currency.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Form Actions */}
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline">
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={form.handleSubmit(handleSubmit)}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {initialData ? "Mettre à jour" : "Créer la classe"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Form>
        </div>

        {/* Summary Sidebar */}
        <div className="w-full lg:w-80">
          <SummaryCard formData={watchedValues} sessions={sessions} />
        </div>
      </div>
    </div>
  );
};

// Main Create Page Component
const CreatePage = () => {
  const [activeTab, setActiveTab] = useState("class");

  const handleClassSubmit = async (data) => {
    console.log("Class data:", data);
    // Here you would typically make an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="w-full mx-auto py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="class" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Classe</span>
            </TabsTrigger>
            <TabsTrigger value="group" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Groupe</span>
            </TabsTrigger>
            <TabsTrigger value="session" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Séance</span>
            </TabsTrigger>
            <TabsTrigger value="post" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Post</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="class">
          <ClassForm onSubmit={handleClassSubmit} />
        </TabsContent>

        <TabsContent value="group">
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">
              Formulaire de création de groupe
            </h3>
            <p className="text-gray-600">
              À implémenter dans la prochaine itération
            </p>
          </div>
        </TabsContent>

        <TabsContent value="session">
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">
              Formulaire de création de séance
            </h3>
            <p className="text-gray-600">
              À implémenter dans la prochaine itération
            </p>
          </div>
        </TabsContent>

        <TabsContent value="post">
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">
              Formulaire de création de post
            </h3>
            <p className="text-gray-600">
              À implémenter dans la prochaine itération
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatePage;
