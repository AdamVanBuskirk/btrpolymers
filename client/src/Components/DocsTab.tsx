// DocsTab.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdEdit, MdDelete } from "react-icons/md";

import { axiosPrivate } from "../Core/axios";
import { getCompany } from "../Store/Company";
import {
  fetchDocs,
  uploadDocsFiles,
  createDocsLink,
  deleteDocsArtifact,
  clearDocsError,
  setDocs,
  getDocs,
  getDocsLoading,
  getDocsUploading,
  getDocsError,
  type ArtifactCategory,
  type DocsArtifact,
} from "../Store/Docs";

function bytesToNice(bytes?: number) {
  if (!bytes || bytes <= 0) return "";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function safeUrl(u: string) {
  try {
    const url = new URL(u);
    return url.toString();
  } catch {
    return "";
  }
}

function isValidDateString(s?: string) {
  if (!s) return false;
  const t = new Date(s).getTime();
  return Number.isFinite(t);
}

function formatDate(s?: string) {
  if (!isValidDateString(s)) return "";
  return new Date(s as string).toLocaleDateString();
}

function guessCategoryFromFile(file: File): ArtifactCategory {
  const mt = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();

  // Prefer MIME when available
  if (mt.startsWith("video/")) return "video";
  if (mt.startsWith("image/")) return "image";

  // Fallback to extensions when MIME is missing/blank
  const videoExt = [".mp4", ".mov", ".m4v", ".webm", ".avi", ".mkv"];
  if (videoExt.some((e) => name.endsWith(e))) return "video";

  const imageExt = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp", ".tiff", ".tif", ".heic"];
  if (imageExt.some((e) => name.endsWith(e))) return "image";

  const docExt = [".pdf", ".doc", ".docx", ".pages", ".rtf", ".txt"];
  if (docExt.some((e) => name.endsWith(e))) return "document";

  const sheetExt = [".csv", ".xls", ".xlsx", ".numbers"];
  if (sheetExt.some((e) => name.endsWith(e))) return "spreadsheet";

  return "other";
}

function categoryLabel(cat: ArtifactCategory) {
  switch (cat) {
    case "video":
      return "Video";
    case "document":
      return "Document";
    case "spreadsheet":
      return "Spreadsheet";
    case "image":
      return "Image";
    case "link":
      return "Link";
    default:
      return "Other";
  }
}

function categoryIcon(cat: ArtifactCategory) {
  switch (cat) {
    case "video":
      return "🎬";
    case "document":
      return "📄";
    case "spreadsheet":
      return "📊";
    case "image":
      return "🖼️";
    case "link":
      return "🔗";
    default:
      return "📦";
  }
}

function isRealArtifact(a: Partial<DocsArtifact> | any): a is DocsArtifact {
  const idOk = typeof a?._id === "string" && a._id.trim().length > 0;

  const hasDisplayValue =
    (typeof a?.title === "string" && a.title.trim().length > 0) ||
    (typeof a?.fileName === "string" && a.fileName.trim().length > 0) ||
    (typeof a?.url === "string" && a.url.trim().length > 0);

  const createdAtOk = a?.createdAt ? isValidDateString(a.createdAt) : true;

  return !!idOk && !!hasDisplayValue && createdAtOk;
}

// local-only flag for optimistic cards (doesn't need to exist in your type)
type OptimisticDoc = DocsArtifact & { __optimistic?: boolean; __tempGroupId?: string };

export default function DocsTab() {
  const dispatch = useDispatch();

  const companyState = useSelector(getCompany);

  const docsRaw = useSelector(getDocs);
  const loading = useSelector(getDocsLoading);
  const uploading = useSelector(getDocsUploading);
  const error = useSelector(getDocsError);

  const companyId: string = companyState?.company?._id || "";

  const role = companyState?.members?.find((m: any) => m.me)?.role || "";
  const canManage = role === "owner" || role === "admin";

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkDescription, setLinkDescription] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editTargetId, setEditTargetId] = useState<string>("");
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<DocsArtifact | null>(null);

  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<ArtifactCategory | "all">("all");

  useEffect(() => {
    if (!companyId) return;
    dispatch(fetchDocs({ companyId }) as any);
  }, [dispatch, companyId]);

  useEffect(() => {
    return () => {
      dispatch(clearDocsError());
    };
  }, [dispatch]);

  const docs = useMemo(() => (docsRaw || []).filter(isRealArtifact) as OptimisticDoc[], [docsRaw]);

  const filteredDocs = useMemo(() => {
    const q = search.trim().toLowerCase();

    return docs
      .filter((d) => (filterCat === "all" ? true : d.category === filterCat))
      .filter((d) => {
        if (!q) return true;
        const hay = `${d.title ?? ""} ${d.description ?? ""} ${d.fileName ?? ""} ${d.url ?? ""}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => {
        // keep optimistic docs at the very top (stable ordering)
        const ao = a.__optimistic ? 1 : 0;
        const bo = b.__optimistic ? 1 : 0;
        if (ao !== bo) return bo - ao;

        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      });
  }, [docs, filterCat, search]);

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedFiles(Array.from(e.target.files || []));
  }

  function onDropFiles(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (!canManage) return;
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length) setSelectedFiles(files);
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function openAddLink() {
    if (!canManage) return;
    setLinkTitle("");
    setLinkUrl("");
    setLinkDescription("");
    setLinkError(null);
    setShowLinkModal(true);
  }

  function closeAddLink() {
    setShowLinkModal(false);
    setLinkError(null);
  }

  function closeEdit() {
    setShowEditModal(false);
    setEditTargetId("");
    setEditTitle("");
    setEditUrl("");
    setEditDescription("");
    setEditError(null);
  }

  async function onOpenArtifact(a: DocsArtifact) {
    if (a.kind === "link") {
      if (!a.url) return;
      window.open(a.url, "_blank", "noopener,noreferrer");
      return;
    }

    if (!companyId) return;

    try {
      const res = await axiosPrivate.get(`api/docs/${companyId}/${a._id}/open`, {
        withCredentials: true,
      });

      const url = res?.data?.url;
      if (!url) return;

      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      console.error(e);
    }
  }

  function openEditArtifact(a: DocsArtifact) {
    if (!canManage) return;

    setEditError(null);
    setEditTargetId(a._id);
    setEditTitle(a.title || "");
    setEditDescription(a.description || "");
    setEditUrl(a.kind === "link" ? a.url || "" : "");
    setShowEditModal(true);
  }

  /**
   * ✅ Smooth upload:
   * 1) Optimistically insert temp cards into redux (no flash)
   * 2) Await backend, then replace those temp ids with real docs returned
   * 3) Optional delayed reconcile fetch (no immediate list reset)
   */
  async function onUpload() {
    if (!canManage || !companyId || !selectedFiles.length) return;

    const tempGroupId = `tmpgrp_${Date.now()}`;
    const nowIso = new Date().toISOString();

    const current = (docsRaw || []).filter(isRealArtifact) as OptimisticDoc[];

    const optimisticDocs: OptimisticDoc[] = selectedFiles.map((f, idx) => {
      const cat = guessCategoryFromFile(f);
      const tempId = `${tempGroupId}_${idx}`;
      return {
        _id: tempId,
        __optimistic: true,
        __tempGroupId: tempGroupId,

        kind: "file",
        category: cat,
        title: (uploadTitle.trim() || f.name) as any,
        description: uploadDescription.trim() || "",
        fileName: f.name as any,
        mimeType: f.type as any,
        fileSizeBytes: f.size as any,

        createdAt: nowIso as any,
        active: true as any,
      } as any;
    });

    // ✅ optimistic insert: new cards appear instantly (no flash)
    dispatch(setDocs([...optimisticDocs, ...current]) as any);

    const payload = {
      companyId,
      title: uploadTitle.trim() || undefined,
      description: uploadDescription.trim() || undefined,
      files: selectedFiles.map((f) => ({
        file: f,
        category: guessCategoryFromFile(f),
      })),
    };

    // reset form UI immediately
    setSelectedFiles([]);
    setUploadTitle("");
    setUploadDescription("");
    if (fileInputRef.current) fileInputRef.current.value = "";

    try {
      // IMPORTANT: uploadDocsFiles should return created docs array (res.data)
      const created = await (dispatch(uploadDocsFiles(payload) as any) as any).unwrap?.();

      // If thunk returns created docs array, replace the optimistic cards 1:1 by index
      if (Array.isArray(created) && created.length > 0) {
        const afterUpload = (getDocsFromStoreSafe(docsRaw) as OptimisticDoc[]).length
          ? ((docsRaw || []).filter(isRealArtifact) as OptimisticDoc[])
          : [...optimisticDocs, ...current];

        const next = afterUpload.map((d) => d);

        const tempIds = optimisticDocs.map((d) => d._id);
        for (let i = 0; i < created.length && i < tempIds.length; i++) {
          const tempId = tempIds[i];
          const replaceIndex = next.findIndex((x) => x._id === tempId);
          if (replaceIndex !== -1) {
            next[replaceIndex] = created[i];
          } else {
            // if temp not found for some reason, just prepend
            next.unshift(created[i]);
          }
        }

        // remove any leftover optimistic cards from this group that didn't get replaced
        const cleaned = next.filter((d) => !(d.__optimistic && d.__tempGroupId === tempGroupId));

        dispatch(setDocs(cleaned) as any);
      } else {
        // No returned docs? fallback reconcile
        setTimeout(() => {
          dispatch(fetchDocs({ companyId }) as any);
        }, 600);
      }

      // Optional: soft reconcile (delayed) to ensure perfect truth without flashing
      setTimeout(() => {
        dispatch(fetchDocs({ companyId }) as any);
      }, 1200);
    } catch (e) {
      // rollback optimistic cards on error
      const rolledBack = (docsRaw || []).filter(isRealArtifact) as OptimisticDoc[];
      dispatch(setDocs(rolledBack) as any);
      console.error(e);
    }
  }

  // helper to avoid TS complaining about stale closure usage;
  // not strictly required, but keeps the intent obvious.
  function getDocsFromStoreSafe(raw: any) {
    return (raw || []).filter(isRealArtifact);
  }

  async function onSaveLink() {
    if (!canManage || !companyId) return;

    const cleanTitle = linkTitle.trim();
    const cleanUrl = safeUrl(linkUrl.trim());
    const cleanDesc = linkDescription.trim();

    if (!cleanTitle) return setLinkError("Please enter a title.");
    if (!cleanUrl) return setLinkError("Please enter a valid URL (including https://).");

    const tempId = `tmp_${Date.now()}`;
    const optimistic: OptimisticDoc = {
      _id: tempId,
      __optimistic: true,

      kind: "link",
      category: "link",
      title: cleanTitle,
      description: cleanDesc || "",
      url: cleanUrl,
      createdAt: new Date().toISOString(),
      active: true as any,
    } as any;

    const current = (docsRaw || []).filter(isRealArtifact) as OptimisticDoc[];
    dispatch(setDocs([optimistic, ...current]) as any);

    try {
      const created = await (dispatch(
        createDocsLink({
          companyId,
          title: cleanTitle,
          url: cleanUrl,
          description: cleanDesc || undefined,
        }) as any
      ) as any).unwrap(); // ✅ no optional chaining
    
      // ✅ replace optimistic temp item with server item
      const current = (docsRaw || []).filter(isRealArtifact);
      dispatch(setDocs(current.map((d: any) => (d._id === tempId ? created : d))) as any);
    
      closeAddLink();        // ✅ closes modal
      setLinkError(null);    // ✅ clears modal error
    } catch (err) {
      dispatch(setDocs(current) as any);
      setLinkError("Could not save link. Please try again.");
    }
    

  }

  async function onSaveEdit() {
    if (!canManage || !companyId || !editTargetId) return;

    const cleanTitle = editTitle.trim();
    const cleanDesc = editDescription.trim();
    const cleanUrl = safeUrl(editUrl.trim());

    if (!cleanTitle) return setEditError("Please enter a title.");

    const current = (docsRaw || []).filter(isRealArtifact) as OptimisticDoc[];
    const idx = current.findIndex((d) => d._id === editTargetId);
    if (idx === -1) return closeEdit();

    const original = current[idx];

    if (original.kind === "link" && !cleanUrl) return setEditError("Please enter a valid URL (including https://).");

    const updated: DocsArtifact = {
      ...original,
      title: cleanTitle,
      description: cleanDesc || "",
      ...(original.kind === "link" ? { url: cleanUrl } : {}),
    };

    const next = [...current];
    next[idx] = updated as any;

    dispatch(setDocs(next) as any);
    closeEdit();

    // keep your current behavior
    dispatch(fetchDocs({ companyId }) as any);
  }

  function requestDelete(a: DocsArtifact) {
    if (!canManage) return;
    setDeleteTarget(a);
  }

  async function doDeleteArtifact(a: DocsArtifact) {
    if (!canManage || !companyId) return;

    const current = (docsRaw || []).filter(isRealArtifact) as OptimisticDoc[];
    dispatch(setDocs(current.filter((d) => d._id !== a._id)) as any);

    try {
      await (dispatch(deleteDocsArtifact({ companyId, id: a._id }) as any) as any).unwrap?.();
    } catch {
      dispatch(setDocs(current) as any);
    } finally {
      // soft reconcile only
      setTimeout(() => dispatch(fetchDocs({ companyId }) as any), 800);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    await doDeleteArtifact(target);
  }

  const accept = [
    "video/*",
    "image/*",
    ".pdf",
    ".doc",
    ".docx",
    ".pages",
    ".csv",
    ".xls",
    ".xlsx",
    ".numbers",
  ].join(",");

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <div>
          <div style={styles.h1}>Docs</div>
          <div style={styles.sub}>
            Upload product docs, cross-sell lists, sales literature, training videos, images, or add helpful links.
          </div>
        </div>

        {canManage && (
          <div style={styles.headerActions}>
            <button type="button" style={styles.secondaryBtn} onClick={openAddLink} disabled={loading || uploading}>
              + Add Link
            </button>
            <button
              type="button"
              style={styles.primaryBtn}
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || uploading}
            >
              + Upload Files
            </button>
          </div>
        )}
      </div>

      {(error || (editError && showEditModal) ) && (
        <div style={styles.errorBanner}>{editError || error}</div>
      )}

      <div style={styles.controls}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search docs..." style={styles.search} />

        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value as any)} style={styles.select}>
          <option value="all">All types</option>
          <option value="video">Videos</option>
          <option value="document">Documents</option>
          <option value="spreadsheet">Spreadsheets</option>
          <option value="image">Images</option>
          <option value="link">Links</option>
          <option value="other">Other</option>
        </select>
      </div>

      {canManage && (
        <div style={styles.uploaderWrap}>
          <input ref={fileInputRef} type="file" multiple accept={accept} style={{ display: "none" }} onChange={onPickFiles} />

          <div style={styles.dropzone} onDrop={onDropFiles} onDragOver={onDragOver}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={styles.dropTitle}>Drag & drop files here</div>
                <div style={styles.dropSub}>Videos, PDFs, Word/Pages, CSV/Excel/Numbers, and images.</div>
              </div>
              <button type="button" style={styles.ghostBtn} onClick={() => fileInputRef.current?.click()} disabled={loading || uploading}>
                Browse
              </button>
            </div>

            <div style={styles.uploadMetaGrid}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={styles.label}>Title (optional)</label>
                <input value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} placeholder="e.g., Cross-sell list (Q1)" style={styles.input} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={styles.label}>Description (optional)</label>
                <input value={uploadDescription} onChange={(e) => setUploadDescription(e.target.value)} placeholder="Add a quick note for your team..." style={styles.input} />
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div style={styles.selectedFiles}>
                <div style={styles.selectedTitle}>Selected files</div>
                <div style={styles.selectedList}>
                  {selectedFiles.map((f) => (
                    <div key={`${f.name}-${f.size}`} style={styles.filePill}>
                      <span style={{ marginRight: 8 }}>{categoryIcon(guessCategoryFromFile(f))}</span>
                      <span style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                      <span style={{ marginLeft: 10, color: "#6b7280" }}>{bytesToNice(f.size)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
                  <button type="button" style={styles.primaryBtn} onClick={onUpload} disabled={uploading || loading}>
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                  <button
                    type="button"
                    style={styles.secondaryBtn}
                    onClick={() => {
                      setSelectedFiles([]);
                      setUploadTitle("");
                      setUploadDescription("");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    disabled={uploading || loading}
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={styles.grid}>
        {loading && docs.length === 0 ? (
          <div style={styles.emptyCard}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Loading…</div>
            <div style={{ color: "#6b7280" }}>Fetching your docs.</div>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div style={styles.emptyCard}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>No docs yet</div>
            <div style={{ color: "#6b7280" }}>
              {canManage ? "Upload a file or add a link to get started." : "Ask an owner/admin to upload docs here."}
            </div>
          </div>
        ) : (
          filteredDocs.map((a) => {
            const dateText = formatDate(a.createdAt);
            const canOpen = true;

            return (
              <div
                key={a._id}
                style={{
                  ...styles.card,
                  opacity: (a as any).__optimistic ? 0.7 : 1,
                }}
              >
                <div
                  style={{ cursor: canOpen ? "pointer" : "default" }}
                  onClick={() => {
                    // prevent clicking optimistic "file" cards before real id exists
                    if ((a as any).__optimistic) return;
                    if (canOpen) onOpenArtifact(a);
                  }}
                >
                  <div style={styles.cardTop}>
                    <div style={styles.iconWrap}>{categoryIcon(a.category)}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={styles.cardTitle} title={a.title}>
                        {a.title}
                      </div>
                      <div style={styles.metaRow}>
                        <span style={styles.metaPill}>{categoryLabel(a.category)}</span>
                        {a.kind === "file" && a.fileSizeBytes ? <span style={styles.metaText}>{bytesToNice(a.fileSizeBytes)}</span> : null}
                        {dateText ? <span style={styles.metaText}>{dateText}</span> : null}
                        {(a as any).__optimistic ? <span style={styles.metaText}>Uploading…</span> : null}
                      </div>
                    </div>
                  </div>

                  {a.description ? (
                    <div style={styles.cardDesc}>{a.description}</div>
                  ) : (
                    <div style={styles.cardDescMuted}>{a.kind === "link" ? a.url : a.fileName}</div>
                  )}
                </div>

                <div style={styles.cardActions}>
                  {canManage && (
                    <button
                      type="button"
                      style={styles.iconBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        if ((a as any).__optimistic) return;
                        openEditArtifact(a);
                      }}
                      title="Edit"
                      aria-label="Edit"
                      disabled={loading || (a as any).__optimistic}
                    >
                      <MdEdit size={18} />
                    </button>
                  )}

                  {canManage && (
                    <button
                      type="button"
                      style={styles.iconBtnDanger}
                      onClick={(e) => {
                        e.stopPropagation();
                        if ((a as any).__optimistic) return;
                        requestDelete(a);
                      }}
                      title="Delete"
                      aria-label="Delete"
                      disabled={loading || (a as any).__optimistic}
                    >
                      <MdDelete size={18} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Link Modal */}
      {showLinkModal && (
        <div style={styles.modalOverlay} onMouseDown={closeAddLink}>
          <div style={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>Add Link</div>
              <button type="button" style={styles.modalClose} onClick={closeAddLink}>
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.field}>
                <label style={styles.label}>Title</label>
                <input
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="e.g., Competitor battlecard"
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>URL</label>
                <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." style={styles.input} />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Description (optional)</label>
                <input
                  value={linkDescription}
                  onChange={(e) => setLinkDescription(e.target.value)}
                  placeholder="What should the team use this for?"
                  style={styles.input}
                />
              </div>

              {linkError && <div style={styles.inlineError}>{linkError}</div>}
            </div>

            <div style={styles.modalFooter}>
              <button type="button" className="button-primary-cancel" onClick={closeAddLink} disabled={uploading}>
                Cancel
              </button>
              <button type="button" className="button-primary" onClick={onSaveLink} disabled={uploading || !companyId}>
                Save Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div style={styles.modalOverlay} onMouseDown={closeEdit}>
          <div style={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>Edit Doc</div>
              <button type="button" style={styles.modalClose} onClick={closeEdit}>
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.field}>
                <label style={styles.label}>Title</label>
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={styles.input} />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>URL (links only)</label>
                <input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} placeholder="https://..." style={styles.input} />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Description (optional)</label>
                <input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} style={styles.input} />
              </div>

              {editError && <div style={styles.inlineError}>{editError}</div>}
            </div>

            <div style={styles.modalFooter}>
              <button type="button" className="button-primary-cancel" onClick={closeEdit} disabled={uploading}>
                Cancel
              </button>
              <button type="button" className="button-primary" onClick={onSaveEdit} disabled={uploading || !companyId}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
          }}
          onMouseDown={() => setDeleteTarget(null)}
        >
          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "16px",
              width: "450px",
              maxWidth: "calc(100% - 24px)",
              textAlign: "center",
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>Delete Doc?</h3>
            <p style={{ marginBottom: 0 }}>
              This action cannot be undone.
              <br />
              <span style={{ fontWeight: 700 }}>{deleteTarget.title}</span>
            </p>

            <div style={{ marginTop: "20px" }}>
              <button
                onClick={() => setDeleteTarget(null)}
                className="button-primary-cancel"
                style={{ marginRight: "10px" }}
              >
                Cancel
              </button>
              <button onClick={confirmDelete} className="button-primary" style={{ marginRight: "10px" }}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: 16, width: "100%", boxSizing: "border-box" },
  headerRow: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 14 },
  h1: { fontSize: 22, fontWeight: 900, letterSpacing: -0.2 },
  sub: { marginTop: 4, color: "#6b7280", fontSize: 13, lineHeight: 1.4, maxWidth: 760 },
  headerActions: { display: "flex", gap: 10, flexWrap: "wrap" },

  errorBanner: { background: "#FEE2E2", color: "#991B1B", border: "1px solid #FCA5A5", borderRadius: 12, padding: "10px 12px", marginBottom: 12, fontWeight: 700, fontSize: 13 },

  controls: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 },
  search: { flex: "1 1 280px", minWidth: 220, borderRadius: 12, border: "1px solid #e5e7eb", padding: "10px 12px", outline: "none", fontSize: 14 },
  select: { flex: "0 0 auto", borderRadius: 12, border: "1px solid #e5e7eb", padding: "10px 12px", outline: "none", fontSize: 14, background: "white" },

  uploaderWrap: { marginBottom: 14 },
  dropzone: { border: "1px dashed #d1d5db", background: "#fafafa", borderRadius: 16, padding: 14 },
  dropTitle: { fontWeight: 900, fontSize: 14 },
  dropSub: { marginTop: 3, color: "#6b7280", fontSize: 13 },
  uploadMetaGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginTop: 12 },
  label: { fontSize: 12, fontWeight: 800, color: "#374151" },
  input: { borderRadius: 12, border: "1px solid #e5e7eb", padding: "10px 12px", outline: "none", fontSize: 14, background: "white" },

  selectedFiles: { marginTop: 12 },
  selectedTitle: { fontWeight: 900, marginBottom: 8 },
  selectedList: { display: "flex", flexDirection: "column", gap: 8 },
  filePill: { display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 12, border: "1px solid #e5e7eb", background: "white", overflow: "hidden" },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 },
  card: { border: "1px solid #e5e7eb", borderRadius: 16, padding: 14, background: "white", boxShadow: "0 1px 8px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", minHeight: 140 },

  cardTop: { display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10, minWidth: 0 },
  iconWrap: { width: 40, height: 40, borderRadius: 12, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flex: "0 0 auto" },
  cardTitle: { fontWeight: 900, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  metaRow: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6, alignItems: "center" },
  metaPill: { fontSize: 12, fontWeight: 800, color: "#111827", background: "#f3f4f6", borderRadius: 999, padding: "4px 8px" },
  metaText: { fontSize: 12, color: "#6b7280", fontWeight: 700 },
  cardDesc: { color: "#374151", fontSize: 13, lineHeight: 1.4, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" },
  cardDescMuted: { color: "#6b7280", fontSize: 13, lineHeight: 1.4, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" },

  cardActions: { marginTop: "auto", display: "flex", gap: 10, alignItems: "center" },

  emptyCard: { border: "1px solid #e5e7eb", borderRadius: 16, padding: 18, background: "#fafafa", color: "#111827" },

  primaryBtn: { borderRadius: "9999px", border: "1px solid #111827", background: "#111827", color: "white", padding: "6px 30px", fontWeight: 500, cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.15)" },
  secondaryBtn: { borderRadius: "9999px", border: "1px solid #e5e7eb", background: "white", color: "#111827", padding: "6px 30px", fontWeight: 500, cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.15)" },
  ghostBtn: { borderRadius: "9999px", border: "1px solid #d1d5db", background: "transparent", color: "#111827", padding: "6px 30px", fontWeight: 500, cursor: "pointer" },

  iconBtn: { width: 44, height: 36, borderRadius: 9999, border: "1px solid #e5e7eb", background: "#111827", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.12)" },
  iconBtnDanger: { width: 44, height: 36, borderRadius: 9999, border: "1px solid #fecaca", background: "#fff1f2", color: "#9f1239", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.06)" },

  modalOverlay: { position: "fixed", inset: 0, background: "rgba(17,24,39,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 14, zIndex: 9999 },
  modal: { width: "min(560px, 100%)", background: "white", borderRadius: 16, border: "1px solid #e5e7eb", boxShadow: "0 10px 30px rgba(0,0,0,0.25)", overflow: "hidden" },
  modalHeader: { padding: "12px 14px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 },
  modalTitle: { fontWeight: 900, fontSize: 16 },
  modalClose: { border: "1px solid #fff", background: "white", padding: "6px 10px", cursor: "pointer", fontWeight: 500 },
  modalBody: { padding: 14, display: "flex", flexDirection: "column", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  inlineError: { background: "#FEE2E2", color: "#991B1B", border: "1px solid #FCA5A5", borderRadius: 12, padding: "10px 12px", fontWeight: 800, fontSize: 13 },
  modalFooter: { padding: "12px 14px", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" },
};
