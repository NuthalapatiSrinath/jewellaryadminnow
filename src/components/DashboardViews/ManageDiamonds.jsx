import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDiamonds,
  fetchDiamondFilters,
  deleteDiamond,
  toggleDiamondStatus,
} from "../../redux/slices/diamondSlice";
import diamondService from "../../services/diamondService";
import {
  Plus,
  Trash2,
  Edit,
  Search,
  FileSpreadsheet,
  Zap,
  ChevronLeft,
  ChevronRight,
  X,
  Eye, // Added Eye icon for viewing
  ExternalLink,
} from "lucide-react";
import styles from "./ManageDiamonds.module.css";

// --- SUB-COMPONENT: Skeleton Loader ---
const TableSkeleton = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <tr key={i} className={styles.SkeletonRow}>
        <td>
          <div className={styles.SkeletonBox} style={{ width: "80px" }}></div>
        </td>
        <td>
          <div className={styles.SkeletonBox} style={{ width: "60px" }}></div>
        </td>
        <td>
          <div className={styles.SkeletonBox} style={{ width: "40px" }}></div>
        </td>
        <td>
          <div className={styles.SkeletonBox} style={{ width: "30px" }}></div>
        </td>
        <td>
          <div className={styles.SkeletonBox} style={{ width: "40px" }}></div>
        </td>
        <td>
          <div className={styles.SkeletonBox} style={{ width: "60px" }}></div>
        </td>
        <td>
          <div className={styles.SkeletonBox} style={{ width: "60px" }}></div>
        </td>
        <td>
          <div className={styles.SkeletonBox} style={{ width: "80px" }}></div>
        </td>
      </tr>
    ))}
  </>
);

// --- SUB-COMPONENT: Filter Bar ---
const FilterBar = ({ options, filters, setFilters, onSearch }) => (
  <div className={styles.FilterBar}>
    <div className={styles.SearchWrapper}>
      <Search size={18} className={styles.SearchIcon} />
      <input
        type="text"
        placeholder="Search SKU, Cert Number..."
        className={styles.SearchInput}
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
    </div>

    <div className={styles.FilterGroup}>
      <select
        className={styles.Select}
        value={filters.shape}
        onChange={(e) => setFilters({ ...filters, shape: e.target.value })}
      >
        <option value="">All Shapes</option>
        {options.shapes?.map((s) => (
          <option key={s._id} value={s.code}>
            {s.label}
          </option>
        ))}
      </select>

      <select
        className={styles.Select}
        value={filters.active}
        onChange={(e) => setFilters({ ...filters, active: e.target.value })}
      >
        <option value="">Status: All</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>

      <button className={styles.FilterBtn} onClick={onSearch}>
        Apply Filters
      </button>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
const ManageDiamonds = () => {
  const dispatch = useDispatch();
  const { items, loading, pagination, filterOptions } = useSelector(
    (state) => state.diamonds
  );

  // Local State
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    shape: "",
    active: "",
  });

  // Modal States
  const [showFormModal, setShowFormModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showGenModal, setShowGenModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false); // New state for View Modal

  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null); // New state for viewing item

  // Initial Fetch
  useEffect(() => {
    dispatch(fetchDiamondFilters());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchDiamonds(filters));
  }, [dispatch, filters.page]);

  const handleSearch = () => {
    dispatch(fetchDiamonds({ ...filters, page: 1 }));
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this diamond?"))
      dispatch(deleteDiamond(id));
  };

  const handleToggleStatus = (id, currentStatus) => {
    dispatch(toggleDiamondStatus({ id, isActive: !currentStatus }));
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowFormModal(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setShowFormModal(true);
  };

  // New Handler for Viewing 3D Render
  const handleView = (item) => {
    setViewingItem(item);
    setShowViewModal(true);
  };

  return (
    <div className={styles.Container}>
      <div className={styles.Header}>
        <div>
          <h2 className={styles.Title}>Manage Diamonds</h2>
          <p className={styles.Subtitle}>
            Manage your inventory, pricing, and specifications
          </p>
        </div>
        <div className={styles.Actions}>
          <button
            className={styles.BtnSecondary}
            onClick={() => setShowGenModal(true)}
          >
            <Zap size={16} /> Generate
          </button>
          <button
            className={styles.BtnSecondary}
            onClick={() => setShowBulkModal(true)}
          >
            <FileSpreadsheet size={16} /> Bulk Upload
          </button>
          <button className={styles.BtnPrimary} onClick={handleCreate}>
            <Plus size={16} /> Add New Diamond
          </button>
        </div>
      </div>

      <FilterBar
        options={filterOptions}
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
      />

      {/* DATA TABLE */}
      <div className={styles.TableCard}>
        <div className={styles.TableWrapper}>
          <table className={styles.Table}>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Shape</th>
                <th>Carat</th>
                <th>Color</th>
                <th>Clarity</th>
                <th>Price</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && items.length === 0 ? (
                <TableSkeleton />
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="8" className={styles.EmptyState}>
                    No diamonds found matching your filters.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item._id}
                    className={!item.active ? styles.RowInactive : ""}
                  >
                    <td className={styles.Sku}>{item.sku}</td>
                    <td>
                      <span className={styles.BadgeShape}>
                        {item.shape?.label || item.shape || "N/A"}
                      </span>
                    </td>
                    <td className={styles.TextBold}>{item.carat}</td>
                    <td>{item.color}</td>
                    <td>{item.purity}</td>
                    <td className={styles.Price}>
                      ${item.price?.toLocaleString()}
                    </td>
                    <td>
                      <button
                        className={
                          item.active
                            ? styles.StatusActive
                            : styles.StatusInactive
                        }
                        onClick={() =>
                          handleToggleStatus(item._id, item.active)
                        }
                      >
                        {item.active ? "Active" : "Hidden"}
                      </button>
                    </td>
                    <td className={styles.ActionCell}>
                      {/* View Button */}
                      <button
                        className={styles.IconBtn}
                        onClick={() => handleView(item)}
                        title="View 3D Render"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Edit Button */}
                      <button
                        className={styles.IconBtn}
                        onClick={() => handleEdit(item)}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>

                      {/* Delete Button */}
                      <button
                        className={styles.IconBtnDelete}
                        onClick={() => handleDelete(item._id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className={styles.Pagination}>
          <span className={styles.PageInfo}>
            Page <b>{pagination.currentPage}</b> of{" "}
            <b>{pagination.totalPages}</b>
          </span>
          <div className={styles.PageActions}>
            <button
              className={styles.PageBtn}
              disabled={!pagination.hasPrevPage}
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              className={styles.PageBtn}
              disabled={!pagination.hasNextPage}
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* 1. Edit/Create Form Modal */}
      {showFormModal && (
        <ModalWrapper
          title={editingItem ? "Edit Diamond" : "Add New Diamond"}
          onClose={() => setShowFormModal(false)}
        >
          <DiamondForm
            initialData={editingItem}
            shapes={filterOptions.shapes}
            onClose={() => setShowFormModal(false)}
            onSuccess={() => {
              setShowFormModal(false);
              handleSearch();
            }}
          />
        </ModalWrapper>
      )}

      {/* 2. View 3D Render Modal */}
      {showViewModal && viewingItem && (
        <ModalWrapper
          title={`View Diamond: ${viewingItem.sku}`}
          onClose={() => setShowViewModal(false)}
          wide // Optional prop to make modal wider for video
        >
          <DiamondViewer diamond={viewingItem} />
        </ModalWrapper>
      )}

      {/* 3. Bulk Upload Modal */}
      {showBulkModal && (
        <ModalWrapper
          title="Bulk Upload Excel"
          onClose={() => setShowBulkModal(false)}
        >
          <BulkUploadForm
            onClose={() => setShowBulkModal(false)}
            onSuccess={() => {
              setShowBulkModal(false);
              handleSearch();
            }}
          />
        </ModalWrapper>
      )}

      {/* 4. Generate Modal */}
      {showGenModal && (
        <ModalWrapper
          title="Generate Combinations"
          onClose={() => setShowGenModal(false)}
        >
          <GeneratorForm
            onClose={() => setShowGenModal(false)}
            onSuccess={() => {
              setShowGenModal(false);
              handleSearch();
            }}
          />
        </ModalWrapper>
      )}
    </div>
  );
};

// --- HELPER COMPONENTS ---

const ModalWrapper = ({ title, children, onClose, wide }) => (
  <div className={styles.ModalBackdrop} onClick={onClose}>
    <div
      className={`${styles.ModalContent} ${
        wide ? styles.ModalContentWide : ""
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.ModalHeader}>
        <h3>{title}</h3>
        <button onClick={onClose} className={styles.CloseBtn}>
          <X size={20} />
        </button>
      </div>
      <div className={styles.ModalBody}>{children}</div>
    </div>
  </div>
);

// --- NEW COMPONENT: Diamond Viewer (Displays the 3D Render) ---
const DiamondViewer = ({ diamond }) => {
  // Prioritize Video URL (usually the 360 interactive view)
  const renderUrl = diamond.videoUrl || diamond.imageUrl;

  // Check if it's a known 3D provider (e.g., Vision360)
  const is360 =
    renderUrl &&
    (renderUrl.includes("v360") ||
      renderUrl.includes("vision360") ||
      renderUrl.includes("cutwise"));

  if (!renderUrl) {
    return (
      <div className={styles.EmptyViewer}>
        <p>No image or video available for this diamond.</p>
      </div>
    );
  }

  return (
    <div className={styles.ViewerContainer}>
      {/* Metadata Header */}
      <div className={styles.ViewerMeta}>
        <div className={styles.MetaItem}>
          <span className={styles.Label}>Carat</span>
          <span className={styles.Value}>{diamond.carat}</span>
        </div>
        <div className={styles.MetaItem}>
          <span className={styles.Label}>Color</span>
          <span className={styles.Value}>{diamond.color}</span>
        </div>
        <div className={styles.MetaItem}>
          <span className={styles.Label}>Clarity</span>
          <span className={styles.Value}>{diamond.purity}</span>
        </div>
        <div className={styles.MetaItem}>
          <span className={styles.Label}>Shape</span>
          <span className={styles.Value}>
            {diamond.shape?.label || diamond.shape}
          </span>
        </div>
        {diamond.certUrl && (
          <a
            href={diamond.certUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.CertLink}
          >
            <FileSpreadsheet size={14} /> Certificate
            <ExternalLink size={12} />
          </a>
        )}
      </div>

      {/* The Render/Iframe */}
      <div className={styles.IframeWrapper}>
        {is360 || renderUrl.includes(".mp4") ? (
          <iframe
            src={renderUrl}
            title="Diamond 3D View"
            className={styles.RenderIframe}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        ) : (
          <img src={renderUrl} alt="Diamond" className={styles.RenderImage} />
        )}
      </div>

      <div className={styles.ViewerFooter}>
        <p className={styles.UrlText}>{renderUrl}</p>
        <a
          href={renderUrl}
          target="_blank"
          rel="noreferrer"
          className={styles.BtnSecondary}
        >
          Open in New Tab <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};

const DiamondForm = ({ initialData, shapes, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(
    initialData || {
      sku: "",
      shape: "",
      carat: "",
      color: "",
      purity: "",
      cut: "",
      polish: "",
      symmetry: "",
      fluorescence: "",
      lab: "",
      price: "",
      pricePerCarat: "",
      table: "",
      depth: "",
      certNumber: "",
      certUrl: "",
      imageUrl: "",
      videoUrl: "",
      active: true,
    }
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.pricePerCarat && formData.carat && !formData.price) {
        formData.price = formData.pricePerCarat * formData.carat;
      }

      if (initialData) {
        await diamondService.updateDiamond(initialData._id, formData);
      } else {
        await diamondService.createDiamond(formData);
      }
      onSuccess();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.Form}>
      <div className={styles.Grid3}>
        <div className={styles.InputGroup}>
          <label>Shape</label>
          <select
            name="shape"
            value={formData.shape._id || formData.shape}
            onChange={handleChange}
            required
            className={styles.Input}
          >
            <option value="">Select Shape</option>
            {shapes?.map((s) => (
              <option key={s._id} value={s._id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.InputGroup}>
          <label>Carat</label>
          <input
            name="carat"
            type="number"
            step="0.01"
            value={formData.carat}
            onChange={handleChange}
            required
            className={styles.Input}
          />
        </div>
        <div className={styles.InputGroup}>
          <label>SKU (Optional)</label>
          <input
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="Auto-generated if empty"
            className={styles.Input}
          />
        </div>
      </div>

      <div className={styles.Grid3}>
        <div className={styles.InputGroup}>
          <label>Color</label>
          <input
            name="color"
            value={formData.color}
            onChange={handleChange}
            className={styles.Input}
          />
        </div>
        <div className={styles.InputGroup}>
          <label>Clarity (Purity)</label>
          <input
            name="purity"
            value={formData.purity}
            onChange={handleChange}
            className={styles.Input}
          />
        </div>
        <div className={styles.InputGroup}>
          <label>Cut</label>
          <input
            name="cut"
            value={formData.cut}
            onChange={handleChange}
            className={styles.Input}
          />
        </div>
      </div>

      <div className={styles.Grid3}>
        <div className={styles.InputGroup}>
          <label>Polish</label>
          <input
            name="polish"
            value={formData.polish}
            onChange={handleChange}
            className={styles.Input}
          />
        </div>
        <div className={styles.InputGroup}>
          <label>Symmetry</label>
          <input
            name="symmetry"
            value={formData.symmetry}
            onChange={handleChange}
            className={styles.Input}
          />
        </div>
        <div className={styles.InputGroup}>
          <label>Fluorescence</label>
          <input
            name="fluorescence"
            value={formData.fluorescence}
            onChange={handleChange}
            className={styles.Input}
          />
        </div>
      </div>

      <div className={styles.Grid2}>
        <div className={styles.InputGroup}>
          <label>Price (Total)</label>
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
            className={styles.Input}
          />
        </div>
        <div className={styles.InputGroup}>
          <label>Price Per Carat</label>
          <input
            name="pricePerCarat"
            type="number"
            value={formData.pricePerCarat}
            onChange={handleChange}
            className={styles.Input}
          />
        </div>
      </div>

      <h4 className={styles.SectionTitle}>Additional Details</h4>
      <div className={styles.Grid2}>
        <input
          name="certNumber"
          placeholder="Certificate Number"
          value={formData.certNumber}
          onChange={handleChange}
          className={styles.Input}
        />
        <input
          name="lab"
          placeholder="Lab (GIA/IGI)"
          value={formData.lab}
          onChange={handleChange}
          className={styles.Input}
        />
        <input
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
          className={styles.Input}
        />
        <input
          name="videoUrl"
          placeholder="Video URL (360 Link)"
          value={formData.videoUrl}
          onChange={handleChange}
          className={styles.Input}
        />
      </div>

      {/* Render Preview in Edit Form */}
      {(formData.videoUrl || formData.imageUrl) && (
        <div className={styles.PreviewBox}>
          <p className={styles.HelpText}>Render Preview:</p>
          {formData.videoUrl ? (
            <iframe
              src={formData.videoUrl}
              className={styles.SmallPreview}
              title="Preview"
            />
          ) : (
            <img
              src={formData.imageUrl}
              className={styles.SmallPreviewImg}
              alt="Preview"
            />
          )}
        </div>
      )}

      <div className={styles.ModalActions}>
        <button type="button" onClick={onClose} className={styles.BtnCancel}>
          Cancel
        </button>
        <button type="submit" disabled={loading} className={styles.BtnPrimary}>
          {loading ? "Saving..." : "Save Diamond"}
        </button>
      </div>
    </form>
  );
};

// ... Keep BulkUploadForm and GeneratorForm as they were ...
// (Included for completeness if you copy-paste the whole file)

const BulkUploadForm = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const res = await diamondService.bulkUpload(file);
      alert(res.message);
      onSuccess();
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className={styles.Form}>
      <div className={styles.UploadBox}>
        <FileSpreadsheet size={40} className={styles.UploadIcon} />
        <p>Drag and drop your Excel file here, or click to select.</p>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => setFile(e.target.files[0])}
          className={styles.FileInput}
        />
        {file && <span className={styles.FileName}>{file.name}</span>}
      </div>
      <div className={styles.ModalActions}>
        <button type="button" onClick={onClose} className={styles.BtnCancel}>
          Cancel
        </button>
        <button
          type="submit"
          disabled={uploading}
          className={styles.BtnSuccess}
        >
          {uploading ? "Uploading..." : "Upload Excel"}
        </button>
      </div>
    </form>
  );
};

const GeneratorForm = ({ onClose, onSuccess }) => {
  const [data, setData] = useState({
    shape: "",
    carats: "",
    colors: "",
    clarities: "",
    basePricePerCarat: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...data,
      carats: data.carats.split(",").map((s) => s.trim()),
      colors: data.colors.split(",").map((s) => s.trim()),
      clarities: data.clarities.split(",").map((s) => s.trim()),
    };
    try {
      await diamondService.generateDiamonds(payload);
      alert("Generated successfully!");
      onSuccess();
    } catch (err) {
      alert("Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleGenerate} className={styles.Form}>
      <p className={styles.HelpText}>
        Enter comma separated values (e.g. "1.0, 1.5" or "D, E, F")
      </p>

      <div className={styles.InputGroup}>
        <label>Shape Code</label>
        <input
          placeholder="e.g. ROUND"
          value={data.shape}
          onChange={(e) => setData({ ...data, shape: e.target.value })}
          className={styles.Input}
          required
        />
      </div>

      <div className={styles.Grid2}>
        <div className={styles.InputGroup}>
          <label>Carats</label>
          <input
            placeholder="1.0, 1.5, 2.0"
            value={data.carats}
            onChange={(e) => setData({ ...data, carats: e.target.value })}
            className={styles.Input}
            required
          />
        </div>
        <div className={styles.InputGroup}>
          <label>Price/Carat ($)</label>
          <input
            type="number"
            placeholder="5000"
            value={data.basePricePerCarat}
            onChange={(e) =>
              setData({ ...data, basePricePerCarat: e.target.value })
            }
            className={styles.Input}
            required
          />
        </div>
      </div>

      <div className={styles.Grid2}>
        <div className={styles.InputGroup}>
          <label>Colors</label>
          <input
            placeholder="D, E, F"
            value={data.colors}
            onChange={(e) => setData({ ...data, colors: e.target.value })}
            className={styles.Input}
            required
          />
        </div>
        <div className={styles.InputGroup}>
          <label>Clarities</label>
          <input
            placeholder="VS1, VS2"
            value={data.clarities}
            onChange={(e) => setData({ ...data, clarities: e.target.value })}
            className={styles.Input}
            required
          />
        </div>
      </div>

      <div className={styles.ModalActions}>
        <button type="button" onClick={onClose} className={styles.BtnCancel}>
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={styles.BtnSecondary}
        >
          {loading ? "Generating..." : "Generate Diamonds"}
        </button>
      </div>
    </form>
  );
};

export default ManageDiamonds;
