"use client";

import { useState, useMemo, type FormEvent } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { CardImageField, CardThumb } from "@/components/admin/CardImageField";
import {
  Actions,
  Badge,
  CheckField,
  ConfirmDialog,
  Drawer,
  EditorForm,
  FieldGrid,
  PageIntro,
  RecordList,
  SearchBox,
  SelectField,
  TextArea,
  TextField,
  cellClass,
  fieldClass,
  includesQuery,
  primaryBtn,
  rowClass,
  useRecordEditor,
} from "@/components/admin/ui";
import { categories, type Course } from "@/data/content";
import {
  blankCourse,
  categoryName,
  feeAmount,
  normalizeFee,
  removeWhere,
  resolveSlug,
  upsert,
} from "@/lib/admin-store";

export default function AdminCoursesPage() {
  const { store, update } = useAdmin();
  const editor = useRecordEditor<Course>();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(
    () =>
      store.courses.filter((course) => {
        const categoryMatch = category === "all" || course.category === category;
        return (
          categoryMatch &&
          includesQuery(query, [course.title, course.instructor, course.fee, categoryName(course.category)])
        );
      }),
    [store.courses, query, category],
  );

  function save(event: FormEvent) {
    event.preventDefault();
    const draft = editor.draft;
    if (!draft) return;
    if (!draft.title.trim()) return editor.setError("Enter a course title.");
    if (!draft.description.trim()) return editor.setError("Enter a description.");
    if (!draft.instructor.trim()) return editor.setError("Enter the instructor.");
    if (!draft.duration.trim() || !draft.startDate.trim() || !draft.time.trim()) {
      return editor.setError("Enter the duration, start date, and time.");
    }
    if (!draft.audience.trim()) return editor.setError("Enter who the course is for.");
    if (!draft.image.trim()) return editor.setError("Upload a card image.");
    const fee = normalizeFee(draft.fee);
    if (feeAmount(fee) <= 0) return editor.setError("Enter a fee, such as $249.");
    const slug = resolveSlug({
      slug: draft.slug,
      title: draft.title,
      existing: store.courses.map((course) => course.slug),
      current: editor.originalKey.current,
    });
    if ("error" in slug) return editor.setError(slug.error);

    const prerequisites = (draft.prerequisites ?? []).map((item) => item.trim()).filter(Boolean);
    const next: Course = {
      ...draft,
      slug: slug.slug,
      title: draft.title.trim(),
      description: draft.description.trim(),
      instructor: draft.instructor.trim(),
      duration: draft.duration.trim(),
      delivery: draft.delivery.trim() || "Live Online",
      startDate: draft.startDate.trim(),
      time: draft.time.trim(),
      audience: draft.audience.trim(),
      image: draft.image.trim(),
      fee,
      joinUrl: draft.joinUrl?.trim() || undefined,
      featured: Boolean(draft.featured),
      outcomes: draft.outcomes.map((item) => item.trim()).filter(Boolean),
      prerequisites: prerequisites.length ? prerequisites : undefined,
    };
    update((current) => ({
      ...current,
      courses: upsert(current.courses, next, (course) => course.slug, editor.originalKey.current),
    }));
    editor.close();
  }

  function remove(course: Course) {
    update((current) => ({
      ...current,
      courses: removeWhere(current.courses, (item) => item.slug, course.slug),
    }));
    editor.setPendingDelete(null);
  }

  function toggleFeatured(course: Course) {
    update((current) => ({
      ...current,
      courses: current.courses.map((item) =>
        item.slug === course.slug ? { ...item, featured: !item.featured } : item,
      ),
    }));
  }

  const draft = editor.draft;

  return (
    <div>
      <PageIntro
        title="Courses"
        description="Live programs on the catalog, including fees, schedules, and join links."
        action={
          <button type="button" onClick={() => editor.openCreate(blankCourse())} className={primaryBtn}>
            Add course
          </button>
        }
      />

      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <div className="md:w-80">
          <SearchBox value={query} onChange={setQuery} placeholder="Search courses" />
        </div>
        <select
          aria-label="Category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className={`${fieldClass} md:w-64`}
        >
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-3 text-xs font-medium text-muted">
        {filtered.length} of {store.courses.length}
      </p>

      <RecordList
        items={filtered}
        columns={["Course", "Instructor", "Starts", "Fee", "Catalog", "Actions"]}
        getKey={(course) => course.slug}
        empty={query || category !== "all" ? "Nothing matches that filter." : "Add the first course."}
        card={(course) => (
          <div>
            <CardThumb src={course.image} />
            <p className="mt-3 font-semibold text-navy">{course.title}</p>
            <p className="mt-1 text-xs text-muted">
              {categoryName(course.category)} · {course.instructor}
            </p>
            <p className="mt-2 text-sm text-navy">
              {course.fee} · {course.startDate}
            </p>
            <div className="mt-3">
              <button type="button" onClick={() => toggleFeatured(course)}>
                <Badge tone={course.featured ? "orange" : "sand"}>{course.featured ? "Featured" : "Standard"}</Badge>
              </button>
            </div>
            <div className="mt-4">
              <Actions
                onEdit={() => editor.openEdit(course, course.slug)}
                onDelete={() => editor.setPendingDelete(course)}
              />
            </div>
          </div>
        )}
        row={(course) => (
          <tr className={rowClass}>
            <td className={cellClass}>
              <div className="flex items-center gap-3">
                <CardThumb src={course.image} compact />
                <div>
                  <p className="font-medium text-navy">{course.title}</p>
                  <p className="mt-1 text-xs text-muted">{categoryName(course.category)}</p>
                </div>
              </div>
            </td>
            <td className={cellClass}>{course.instructor}</td>
            <td className={`${cellClass} whitespace-nowrap`}>
              {course.startDate}
              <span className="mt-1 block text-xs text-muted">{course.time}</span>
            </td>
            <td className={`${cellClass} whitespace-nowrap font-semibold`}>{course.fee}</td>
            <td className={cellClass}>
              <button type="button" onClick={() => toggleFeatured(course)}>
                <Badge tone={course.featured ? "orange" : "sand"}>{course.featured ? "Featured" : "Standard"}</Badge>
              </button>
            </td>
            <td className={cellClass}>
              <Actions
                onEdit={() => editor.openEdit(course, course.slug)}
                onDelete={() => editor.setPendingDelete(course)}
              />
            </td>
          </tr>
        )}
      />

      {draft ? (
        <Drawer open title={editor.mode === "edit" ? "Edit course" : "New course"} onClose={editor.close}>
          <EditorForm onSubmit={save} onCancel={editor.close} error={editor.error}>
            <TextField label="Title" value={draft.title} onChange={(title) => editor.patch({ title })} />
            <TextField
              label="URL slug"
              value={draft.slug}
              onChange={(slug) => editor.patch({ slug })}
              hint="Leave this blank to build it from the title."
            />
            <SelectField
              label="Category"
              value={draft.category}
              onChange={(value) => editor.patch({ category: value })}
              options={categories.map((item) => ({ value: item.slug, label: item.name }))}
            />
            <CheckField
              label="Feature on the catalog"
              checked={Boolean(draft.featured)}
              onChange={(featured) => editor.patch({ featured })}
            />
            <CardImageField
              value={draft.image}
              onChange={(image) => editor.patch({ image })}
              hint="This photo sits at the top of the course card."
            />
            <TextArea
              label="Description"
              value={draft.description}
              onChange={(description) => editor.patch({ description })}
            />
            <TextField label="Audience" value={draft.audience} onChange={(audience) => editor.patch({ audience })} />
            <FieldGrid>
              <TextField
                label="Instructor"
                value={draft.instructor}
                onChange={(instructor) => editor.patch({ instructor })}
              />
              <TextField label="Fee" value={draft.fee} onChange={(fee) => editor.patch({ fee })} placeholder="$249" />
              <TextField label="Duration" value={draft.duration} onChange={(duration) => editor.patch({ duration })} />
              <TextField label="Delivery" value={draft.delivery} onChange={(delivery) => editor.patch({ delivery })} />
              <TextField
                label="Start date"
                value={draft.startDate}
                onChange={(startDate) => editor.patch({ startDate })}
                placeholder="15 September 2026"
              />
              <TextField label="Time" value={draft.time} onChange={(time) => editor.patch({ time })} />
            </FieldGrid>
            <TextField
              label="Join link"
              value={draft.joinUrl ?? ""}
              onChange={(joinUrl) => editor.patch({ joinUrl })}
              hint="Shown after Paystack or Accrue confirms payment."
            />
            <TextArea
              label="Outcomes"
              value={draft.outcomes.join("\n")}
              onChange={(value) => editor.patch({ outcomes: value.split("\n") })}
              hint="One outcome per line."
            />
            <TextArea
              label="Prerequisites"
              value={(draft.prerequisites ?? []).join("\n")}
              onChange={(value) => editor.patch({ prerequisites: value.split("\n") })}
              hint="One prerequisite per line."
            />
          </EditorForm>
        </Drawer>
      ) : null}

      <ConfirmDialog
        open={editor.pendingDelete !== null}
        title="Delete this course?"
        body={
          editor.pendingDelete
            ? `${editor.pendingDelete.title} will be removed from this portal.`
            : ""
        }
        confirmLabel="Delete"
        onCancel={() => editor.setPendingDelete(null)}
        onConfirm={() => {
          if (editor.pendingDelete) remove(editor.pendingDelete);
        }}
      />
    </div>
  );
}

