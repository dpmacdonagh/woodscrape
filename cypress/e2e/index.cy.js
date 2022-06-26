import { createClient } from "@supabase/supabase-js";
import queryString from "query-string";

const supabase = createClient(
  "https://wexdmnfxzybvownkqdma.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndleGRtbmZ4enlidm93bmtxZG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQ2MzE0MDAsImV4cCI6MTk3MDIwNzQwMH0.dcCw9rmfO972ksmEzOwM0Hm15N23DWup72qruQ5iRxY"
);

const baseUrl = 'https://www.etsy.com/search?explicit=1&q=custom+wood+housewarming&ref=pagination&is_personalizable=true'

function goToNextPage() {
  cy.url().then((url) => {
    const parsedUrl = queryString.parse(url);
    const currentPage = parsedUrl.page || 1;
    const nextPage = parseInt(currentPage) + 1;

    cy.visit(
      `${baseUrl}&page=${nextPage}&ref=pagination`
    );

    if (parseInt(nextPage) < 10) {
      cy.wait(3000);
      storePageData();
    }
  });
}

function storePageData() {
  const results = [];
  cy.get('input[name="rating"]').invoke("show");
  cy.get(".v2-listing-card")
    .each((item, index) => {
      if (index !== 0) {
        const purchases = item
          .find(".set-review-stars-line-height-to-zero")
          .siblings("span")
          .text()
          .trim()
          .replace(/[\])}[{(]/g, "")
          .replace(/,/g, "");
        console.log(purchases)
        const rating = item.find("span.screen-reader-only").first().text().trim().split(' ')[0];
        console.log(rating);
        results.push({
          img_src: item.find("img").attr("src"),
          name: item.find(".v2-listing-card__title").text().trim(),
          purchases: parseInt(purchases, 10),
          price: parseFloat(item.find(".currency-value").first().text()),
          id: item.attr("data-listing-id"),
          href: `https://www.etsy.com/listing/${item.attr("data-listing-id")}`,
          rating: parseFloat(rating),
        });
      }
    })
    .then(async () => {
      try {
        const { data, error } = await supabase.from("items").upsert(results);
        console.log(results);
      } catch (error) {
      } finally {
        goToNextPage();
      }
    });
}

describe("Collecting Data", () => {
  before(() => {
    cy.visit(baseUrl);
  });

  it("creating data object", () => {
    storePageData();
  });
});
