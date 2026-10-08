"use client";

import { useId, useMemo, useState, type FormEvent } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { CardImageField, CardThumb } from "@/components/admin/CardImageField";
import {
  Actions,
  ConfirmDialog,
  Drawer,
  EditorForm,
  PageIntro,
  RecordList,
  SearchBox,
  TextArea,
  TextField,
  cellClass,
  fieldClass,
  includesQuery,
  primaryBtn,
  rowClass,
  useRecordEditor,
} from "@/components/admin/ui";
import {
  blankNews,
  newsCategories,
  removeWhere,
  resolveSlug,
  upsert,
  type NewsArticle,
} from "@/lib/admin-store";

export default function AdminNewsPage() {
  const { store, update } = useAdmin();
  const editor = useRecordEditor<NewsArticle>();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const listId = useId();

  const categories = useMemo(
    () => Array.from(new Set([...newsCategories, ...store.news.map((article) => article.category)])),
    [store.news],
  );

  const filtered = useMemo(
    () =>
      store.news.filter((article) => {
        const categoryMatch = category === "all" || article.category === category;
        return categoryMatch && includesQuery(query, [article.title, article.excerpt, article.category]);
      }),
    [store.news, query, category],
  );

  function save(event: FormEvent) {
    event.preventDefault();
    const draft = editor.draft;
    if (!draft) return;
    if (!draft.title.trim()) return editor.setError("Enter a headline.");
    if (!draft.category.trim()) return editor.setError("Enter a category.");
    if (!draft.date.trim()) return editor.setError("Enter a date.");
    if (!draft.excerpt.trim()) return editor.setError("Enter a short excerpt.");
    if (!draft.content.trim()) return editor.setError("Enter the story.");
    if (!draft.image.trim()) return editor.setError("Upload a card image.");
    const slug = resolveSlug({
      slug: draft.slug,
      title: draft.title,
      existing: store.news.map((article) => article.slug),
      current: editor.originalKey.current,
    });
    if ("error" in slug) return editor.setError(slug.error);

    const next: NewsArticle = {
      ...draft,
      slug: slug.slug,
      title: draft.title.trim(),
      category: draft.category.trim(),
      date: draft.date.trim(),
      excerpt: draft.excerpt.trim(),
      image: draft.image.trim(),
      content: draft.content.trim(),
    };
    update((current) => ({
      ...current,
      news: upsert(current.news, next, (article) => article.slug, editor.originalKey.current),
    }));
    editor.close();
  }

  function remove(article: NewsArticle) {
    update((current) => ({
      ...current,
      news: removeWhere(current.news, (item) => item.slug, article.slug),
    }));
    editor.setPendingDelete(null);
  }

  const draft = editor.draft;

  return (
    <div>
      <PageIntro
        title="News"
        description="Announcements, stories, and notes for the news page."
        action={
          <button type="button" onClick={() => editor.openCreate(blankNews())} className={primaryBtn}>
            Add story
          </button>
        }
      />

      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <div className="md:w-80">
          <SearchBox value={query} onChange={setQuery} placeholder="Search news" />
        </div>
        <select
          aria-label="Category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className={`${fieldClass} md:w-72`}
        >
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-3 text-xs font-medium text-muted">
        {filtered.length} of {store.news.length}
      </p>

      <RecordList
        items={filtered}
        columns={["Story", "Category", "Date", "Actions"]}
        getKey={(article) => article.slug}
        empty={query || category !== "all" ? "Nothing matches that filter." : "Add the first story."}
        card={(article) => (
          <div>
            <CardThumb src={article.image} />
            <p className="mt-3 font-semibold text-navy">{article.title}</p>
            <p className="mt-1 text-xs text-muted">
              {article.category} · {article.date}
            </p>
            <p className="mt-2 text-sm text-muted">{article.excerpt}</p>
            <div className="mt-4">
              <Actions
                onEdit={() => editor.openEdit(article, article.slug)}
                onDelete={() => editor.setPendingDelete(article)}
              />
            </div>
          </div>
        )}
        row={(article) => (
          <tr className={rowClass}>
            <td className={cellClass}>
              <div className="flex items-center gap-3">
                <CardThumb src={article.image} compact />
                <div>
                  <p className="font-medium text-navy">{article.title}</p>
                  <p className="mt-1 max-w-md text-xs text-muted">{article.excerpt}</p>
                </div>
              </div>
            </td>
            <td className={cellClass}>{article.category}</td>
            <td className={`${cellClass} whitespace-nowrap`}>{article.date}</td>
            <td className={cellClass}>
              <Actions
                onEdit={() => editor.openEdit(article, article.slug)}
                onDelete={() => editor.setPendingDelete(article)}
              />
            </td>
          </tr>
        )}
      />

      {draft ? (
        <Drawer open title={editor.mode === "edit" ? "Edit story" : "New story"} onClose={editor.close}>
          <EditorForm onSubmit={save} onCancel={editor.close} error={editor.error}>
            <TextField label="Headline" value={draft.title} onChange={(title) => editor.patch({ title })} />
            <TextField
              label="URL slug"
              value={draft.slug}
              onChange={(slug) => editor.patch({ slug })}
              hint="Leave this blank to build it from the headline."
            />
            <TextField
              label="Category"
              value={draft.category}
              list={listId}
              onChange={(value) => editor.patch({ category: value })}
            />
            <datalist id={listId}>
              {categories.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
            <TextField label="Date" value={draft.date} onChange={(date) => editor.patch({ date })} />
            <CardImageField
              value={draft.image}
              onChange={(image) => editor.patch({ image })}
              hint="This photo sits at the top of the story card."
            />
            <TextArea
              label="Excerpt"
              value={draft.excerpt}
              onChange={(excerpt) => editor.patch({ excerpt })}
              rows={3}
            />
            <TextArea label="Story" value={draft.content} onChange={(content) => editor.patch({ content })} rows={8} />
          </EditorForm>
        </Drawer>
      ) : null}

      <ConfirmDialog
        open={editor.pendingDelete !== null}
        title="Delete this story?"
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
