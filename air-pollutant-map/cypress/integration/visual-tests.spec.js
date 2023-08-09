describe("Visual regression tests", () => {
  it("renders initial map", () => {
    cy.visit("http://localhost:8080/");
    cy.contains("Päästömäärä");
    cy.wait(1000);
    cy.matchImageSnapshot({
      failureThreshold: 0.03, // threshold for entire image
      failureThresholdType: "percent"
    });
  });

  it("opens popup", () => {
    cy.get("#map-container").click(325, 520);
    cy.contains("Typen oksidit (t):");
    cy.contains("9.5");
    cy.matchImageSnapshot({
      failureThreshold: 0.03, // threshold for entire image
      failureThresholdType: "percent"
    });
  });

  it("closes popup", () => {
    cy.get(".olpopup-closer").click();
    cy.wait(100);
    cy.matchImageSnapshot({
      failureThreshold: 0.03, // threshold for entire image
      failureThresholdType: "percent"
    });
  });

  it("zooms in on scroll", () => {
    cy.get("#map-container").trigger("wheel", 300, 700, {
      deltaX: 0,
      deltaY: -1000
    });
    cy.wait(1500);
    cy.matchImageSnapshot({
      failureThreshold: 0.03, // threshold for entire image
      failureThresholdType: "percent"
    });
  });

  it("zooms out on scroll", () => {
    cy.get("#map-container").trigger("wheel", 300, 700, {
      deltaX: 0,
      deltaY: 1000
    });
    cy.wait(1500);
    cy.matchImageSnapshot({
      failureThreshold: 0.03, // threshold for entire image
      failureThresholdType: "percent"
    });
  });

  it("shows grid data layer rikkidioksidi (combined)", () => {
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-container-pollutant").click();
      cy.contains("Rikkidioksidi").click();
      cy.get("#select-list-pollutant").should("have.class", "hidden-all");
      cy.get("#selection-input-pollutant").should("have.value", "Rikkidioksidi");
    });
    cy.wait(1500);
    cy.matchImageSnapshot({
      failureThreshold: 0.03, // threshold for entire image
      failureThresholdType: "percent"
    });
  });

  it("shows grid data layer road/transport: rikkidioksidi", () => {
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-container-gnfr").click();
      cy.contains("li", "Road").click();
      cy.get("#select-list-gnfr").should("have.class", "hidden-all");
      cy.get("#selection-input-gnfr").should("have.value", "F_RoadTransport_fi");
    });
    cy.wait(1500);
    cy.matchImageSnapshot({
      failureThreshold: 0.03, // threshold for entire image
      failureThresholdType: "percent"
    });
  });

  it("shows combined grid data layer: rikkidioksidi", () => {
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-container-gnfr").click();
      cy.contains("li", "Kokonaispäästöt").click();
      cy.get("#select-list-gnfr").should("have.class", "hidden-all");
      cy.get("#selection-input-gnfr").should("have.value", "Kokonaispäästöt");
    });
    cy.wait(1500);
    cy.matchImageSnapshot({
      failureThreshold: 0.03, // threshold for entire image
      failureThresholdType: "percent"
    });
  });

  it("shows municipality layer rikkidioksidi", () => {
    cy.contains("Kunnat").click();
    cy.contains("Päästömäärä (t / km2)");
    cy.wait(1500);
    cy.matchImageSnapshot({
      failureThreshold: 0.03, // threshold for entire image
      failureThresholdType: "percent"
    });
  });

  it("shows municipality layer typen oksidit", () => {
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-container-pollutant").click();
      cy.contains("Typen oksidit").click();
      cy.get("#select-list-pollutant").should("have.class", "hidden-all");
      cy.get("#selection-input-pollutant").should("have.value", "Typen oksidit");
    });
    cy.wait(1500);
    cy.matchImageSnapshot({
      failureThreshold: 0.03, // threshold for entire image
      failureThresholdType: "percent"
    });
  });

  it("toggles back to grid data layer (typen oksidit)", () => {
    cy.contains("Ruudukko").click();
    cy.contains("Päästömäärä");
    cy.wait(1500);
    cy.matchImageSnapshot({
      failureThreshold: 0.03, // threshold for entire image
      failureThresholdType: "percent"
    });
  });
});
