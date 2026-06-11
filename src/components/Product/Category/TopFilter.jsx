import { useCallback } from "react";

const TopFilter = ({ setListView, rtl, setShowFilter, showFilter }) => {
  const showListView = useCallback(() => {
    const listBtn = document.querySelector(".list-btn.bttn");
    const gridBtn = document.querySelector(".grid-btn.bttn");
    if (listBtn && gridBtn) {
      listBtn.classList.add("active");
      gridBtn.classList.remove("active");
    }
    setListView(true);
  }, [setListView]);

  const hideListView = useCallback(() => {
    const gridBtn = document.querySelector(".grid-btn.bttn");
    const listBtn = document.querySelector(".list-btn.bttn");
    if (gridBtn && listBtn) {
      gridBtn.classList.add("active");
      listBtn.classList.remove("active");
    }
    setListView(false);
  }, [setListView]);

  const filterView = useCallback(() => {
    setShowFilter((prev) => !prev);
  }, [setShowFilter]);

  return (
    <div className="top-filter mb-10">
      <div className="row align-items-center">
        <div className="col-lg-12">
          <div className="r-side">
            <div className="row align-items-center">
              <div className="col-12">
                <div
                  className="grid-list-btns"
                  style={{ justifyContent: "flex-end" }}
                >
                  <span className="grid-btn bttn active" onClick={hideListView}>
                    <i className="bi bi-grid-3x3"></i>
                  </span>
                  <span className="list-btn bttn" onClick={showListView}>
                    <i className="bi bi-list-task"></i>
                  </span>
                  <span
                    style={{
                      backgroundColor: showFilter ? "#F0F4F8" : "#880a0a",
                      color: showFilter ? "#111" : "#fff",
                      width: "60px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                    }}
                    className="list-btn bttn col-7"
                    onClick={filterView}
                  >
                    <i className="bi bi-filter"></i>
                    فیلتر
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopFilter;
