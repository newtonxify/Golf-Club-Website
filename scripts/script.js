// When the page loads, fetch images.json, then populate each carousel
    document.addEventListener("DOMContentLoaded", () => {
      fetch("images.json")
        .then((resp) => {
          if (!resp.ok) throw new Error("Failed to load images.json");
          return resp.json();
        })
        .then((allImages) => {
          if (!Array.isArray(allImages) || allImages.length === 0) {
            console.warn("No images found in images.json");
            return;
          }

          // Distribute images into three buckets
          const carousels = {
            "carousel1": [],
            "carousel2": [],
            "carousel3": []
          };

          for (let i = 0; i < allImages.length; i++) {
            const bucketIndex = i % 3; // 0 → carousel1, 1 → carousel2, 2 → carousel3
            if (bucketIndex === 0) {
              carousels.carousel1.push(allImages[i]);
            } else if (bucketIndex === 1) {
              carousels.carousel2.push(allImages[i]);
            } else {
              carousels.carousel3.push(allImages[i]);
            }
          }

          // Helper: build one carousel's inner HTML (items + controls)
          function buildCarouselHTML(carouselId, imageList) {
            if (imageList.length === 0) {
              // If no images for this carousel, put a placeholder
              return `
                <div class="d-flex align-items-center justify-content-center" style="height:200px; background-color:#f0f0f0;">
                  <p class="text-muted">No images.</p>
                </div>
              `;
            }

            // Start .carousel-inner
            let innerHTML = `<div class="carousel-inner">`;

            imageList.forEach((imgPath, idx) => {
              innerHTML += `
                <div class="carousel-item ${idx === 0 ? "active" : ""}">
                  <img src="${imgPath}" class="d-block w-100" alt="Slide ${idx}" />
                </div>
              `;
            });

            innerHTML += `</div>`;

            // Add Prev/Next controls
            innerHTML += `
              <button
                class="carousel-control-prev"
                type="button"
                data-bs-target="#${carouselId}"
                data-bs-slide="prev"
              >
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button
                class="carousel-control-next"
                type="button"
                data-bs-target="#${carouselId}"
                data-bs-slide="next"
              >
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            `;

            return innerHTML;
          }

          // Populate carousel1
          document.getElementById("carousel1").innerHTML =
            buildCarouselHTML("carousel1", carousels.carousel1);

          // Populate carousel2
          document.getElementById("carousel2").innerHTML =
            buildCarouselHTML("carousel2", carousels.carousel2);

          // Populate carousel3
          document.getElementById("carousel3").innerHTML =
            buildCarouselHTML("carousel3", carousels.carousel3);

          // Initialize each carousel via JS (so data-bs-interval works)
          // (Bootstrap 5’s data-bs-ride="carousel" already auto-initializes
          new bootstrap.Carousel(
            document.getElementById("carousel1"),
            {
              interval: parseInt(
                document
                  .getElementById("carousel1")
                  .getAttribute("data-bs-interval"),
                10
              ),
            }
          );
          new bootstrap.Carousel(
            document.getElementById("carousel2"),
            {
              interval: parseInt(
                document
                  .getElementById("carousel2")
                  .getAttribute("data-bs-interval"),
                10
              ),
            }
          );
          new bootstrap.Carousel(
            document.getElementById("carousel3"),
            {
              interval: parseInt(
                document
                  .getElementById("carousel3")
                  .getAttribute("data-bs-interval"),
                10
              ),
            }
          );
        })
        .catch((err) => {
          console.error("Error loading or parsing images.json:", err);
        });
    });