const path = require("path");

describe("Page load and initial UI", () => {
  it("renders main div", () => {
    cy.visit("http://localhost:8080/?lang=fi");
    cy.get("div#app-wrapper");
  });

  it("shows year selector", () => {
    cy.contains("Vuosi");
  });

  it("shows GNFR selector", () => {
    cy.contains("Luokka");
  });

  it("shows pollutant selector", () => {
    cy.contains("Päästö");
    cy.contains("Typen oksidit");
  });

  it("shows map data type selector (ruudukko/kunnat)", () => {
    cy.contains("Ruudukko");
    cy.contains("Kunnat");
  });

  it("shows legend", () => {
    cy.contains("Päästömäärä");
  });

  it("shows GNFR description", () => {
    cy.contains("esittää kaikkien inventoitujen");
  });

  it("shows total emission statistics", () => {
    cy.contains("Päästöt yhteensä:");
  });
});

describe("Year selector", () => {
  it("toggles year options visible", () => {
    cy.get("#year-selector-div").within(() => cy.get("#select-container-year").click());
    cy.contains("2015");
    cy.contains("2010");
    cy.contains("2005");
    cy.contains("2000");
    cy.contains("1995");
  });

  it("toggles year options hidden by clicking the input", () => {
    cy.get("#year-selector-div").within(() => {
      cy.get("#select-container-year").click();
      cy.get("#select-list-year").should("have.class", "hidden-all");
    });
  });

  it("toggles year options hidden by clicking outside the input", () => {
    cy.get("#year-selector-div").within(() => cy.get("#select-container-year").click());
    cy.contains("2015");
    cy.get("#map-container").click(325, 525);
    cy.get("#year-selector-div").within(() => {
      cy.get("#select-list-year").should("have.class", "hidden-all");
    });
  });

  it("selects year by clicking an option (2015)", () => {
    cy.get("#year-selector-div").within(() => {
      cy.get("#select-container-year").click();
      cy.contains("li", "2015").click();
      cy.get("#select-list-year").should("have.class", "hidden-all");
      cy.contains("2015");
    });
  });
});

describe("GNFR selector", () => {
  it("toggles GNFR options visible", () => {
    cy.get("#gnfr-selector-div").within(() => cy.get("#select-container-gnfr").click());
    cy.get("#select-list-gnfr").within(() => cy.contains("li", "Liikenne"));
  });

  it("toggles GNFR options hidden by clicking the input", () => {
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-container-gnfr").click();
      cy.get("#select-list-gnfr").should("have.class", "hidden-all");
    });
  });

  it("toggles GNFR options hidden by clicking outside the input", () => {
    cy.get("#gnfr-selector-div").within(() => cy.get("#select-container-gnfr").click());
    cy.contains("Liikenne");
    cy.get("#map-container").click(325, 525);
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-list-gnfr").should("have.class", "hidden-all");
    });
  });

  it("selects GNFR by clicking an option (power)", () => {
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-container-gnfr").click();
      cy.contains("li", "Energiantuotanto").click();
      cy.get("#select-list-gnfr").should("have.class", "hidden-all");
      cy.contains("Energiantuotanto");
    });
  });

  it("selects combined GNFR", () => {
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-container-gnfr").click();
      cy.contains("li", "Kokonaisp").click();
      cy.get("#select-list-gnfr").should("have.class", "hidden-all");
      cy.get("#selection-input-gnfr").should("have.value", "Kokonaispäästöt");
    });
  });

  it("finds & selects option by input value (road & transport)", () => {
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-input-gnfr").click().clear().type("Liiken");
      cy.get("li").click();
      cy.get("#selection-input-gnfr").should("have.value", "Liikenne");
    });
  });

  it("shows previously selected GNFR after exiting selector", () => {
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-input-gnfr").click().clear().type("kokonais{esc}");
      cy.get("#selection-input-gnfr").should("have.value", "Liikenne");
    });
  });

  it("selects option with keyboard actions (combined GNFR)", () => {
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-input-gnfr").click().clear().type("kokonais{downarrow}{enter}");
      cy.get("#selection-input-gnfr").should("have.value", "Kokonaispäästöt");
    });
  });
});

describe("Pollutant selector", () => {
  it("toggles pollutant options visible", () => {
    cy.get("#pollutant-selector-div").within(() =>
      cy.get("#select-container-pollutant").click()
    );
    cy.get("#select-list-pollutant").within(() => cy.contains("Rikkidioksidi"));
  });

  it("toggles pollutant options hidden by clicking the input", () => {
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-container-pollutant").click();
      cy.get("#select-list-pollutant").should("have.class", "hidden-all");
    });
  });

  it("toggles pollutant options hidden by clicking outside the input", () => {
    cy.get("#pollutant-selector-div").within(() =>
      cy.get("#select-container-pollutant").click()
    );
    cy.contains("Rikkidioksidi");
    cy.get("#map-container").click(325, 525);
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-list-pollutant").should("have.class", "hidden-all");
    });
  });

  it("selects pollutant by clicking an option (rikkidioksidi)", () => {
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-container-pollutant").click();
      cy.contains("Rikkidioksidi").click();
      cy.get("#select-list-pollutant").should("have.class", "hidden-all");
      cy.get("#selection-input-pollutant").should("have.value", "Rikkidioksidi");
    });
  });

  it("finds & selects option by input value (hiilimonoksidi)", () => {
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-input-pollutant").click().clear().type("hiilimono");
      cy.get("li").click();
      cy.get("#selection-input-pollutant").should("have.value", "Hiilimonoksidi");
    });
  });

  it("shows previously selected pollutant after exiting selector (hiilimonoksidi)", () => {
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-input-pollutant").click().clear().type("rikkidio{esc}");
      cy.get("#selection-input-pollutant").should("have.value", "Hiilimonoksidi");
    });
  });

  it("selects option with keyboard actions (rikkidioksidi", () => {
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-input-pollutant").click().clear().type("rikkidioksi{downarrow}{enter}");
      cy.get("#selection-input-pollutant").should("have.value", "Rikkidioksidi");
    });
  });
});

describe("Grid data layer", () => {
  it("opens rikkidioksidi layer (2015)", () => {
    cy.visit("http://localhost:8080/?lang=fi");
    cy.get("#year-selector-div").within(() => {
      cy.get("#select-input-year").click();
      cy.contains("li", "2015").click();
    });
    // select rikkidioksidi
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-container-pollutant").click();
      cy.contains("Rikkidioksidi").click();
    });
    // wait until total emissions are shown
    cy.contains("Päästöt yhteensä");
    // wait for the layer and legend to appear
    cy.get(".legend-container").contains("Päästömäärä");
    cy.get(".legend-container").contains("ruudussa (t)");
  });

  it("shows grid layer popup on click", () => {
    cy.get("#map-container").click(325, 525);
    cy.get(".olpopup-content").contains("Rikkidioksidi (t):");
  });

  it("closes popup", () => {
    cy.get(".olpopup-closer").click();
  });

  it("switches to layer: 2015 combined typen oksidit", () => {
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-container-pollutant").click();
      cy.contains("Typen oksidit").click();
    });
    // wait until total emissions and legend are shown
    cy.contains("Päästöt yhteensä");
    cy.get(".legend-container").contains("Päästömäärä");
  });

  it("switches to layer: 2010 combined & typen oksidit", () => {
    cy.get("#year-selector-div").within(() => {
      cy.get("#select-input-year").click();
      cy.contains("li", "2010").click();
    });
    // wait until total emissions and legend are shown
    cy.contains("Päästöt yhteensä");
    cy.get(".legend-container").contains("Päästömäärä");
  });

  it("switches to layer: 2010 transport & typen oksidit", () => {
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-container-gnfr").click();
      cy.contains("li", "Liikenne").click();
    });
    // wait until total emissions and legend are shown
    cy.contains("Valitun luokan osuus");
    cy.get(".legend-container").contains("Päästömäärä");
  });

  it("switches to layer: 2015 agriculture & typen oksidit", () => {
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-container-gnfr").click();
      cy.contains("li", "Maatalous").click();
    });
    cy.get("#year-selector-div").within(() => {
      cy.get("#select-input-year").click();
      cy.contains("li", "2015").click();
    });
    // wait until total emissions and legend are shown
    cy.contains("Valitun luokan osuus");
    cy.get(".legend-container").contains("Päästömäärä");
  });
});

describe("Municipality layer", () => {
  it("toggles municipality layer visible", () => {
    // switch back to typen oksidit
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-input-pollutant").click();
      cy.contains("Typen oksidit").click();
    });
    // switch back to combined data
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-input-gnfr").click();
      cy.contains("li", "Kokonaisp").click();
    });
    cy.contains("Kunnat").click();
    cy.contains("Kokonaisp");
    cy.contains("Päästömäärä (t / km2)");
  });

  it("shows municipality layer popup (2015 combined: typen oksidit)", () => {
    cy.get("#map-container").click(325, 525);
    cy.contains("Kuopio (Typen oksidit):");
  });

  it("updates municipality layer popup on layer change", () => {
    // switch back to typen oksidit
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-input-pollutant").click();
      cy.contains("Elohopea").click();
    });
    // check popup title
    cy.contains("Kuopio (Elohopea):");

    // switch back to typen oksidit
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-input-pollutant").click();
      cy.contains("Typen oksidit").click();
    });
    cy.contains("Kuopio (Typen oksidit):");
  });

  it("closes popup", () => {
    cy.get(".olpopup-closer").click();
  });

  it("switches to layer: 2015 road/transport & rikkidioksidi", () => {
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-input-gnfr").click();
      cy.contains("li", "Transport").click();
    });
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-input-pollutant").click();
      cy.contains("Rikkidioksidi").click();
    });
    // wait until total emissions and legend are shown
    cy.contains("Valitun luokan osuus");
    cy.get(".legend-container").contains("Päästömäärä");
  });

  it("switches to layer: 2010 agriculture & typen oksidit", () => {
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-input-pollutant").click();
      cy.contains("Typen oksidit").click();
    });
    cy.get("#year-selector-div").within(() => {
      cy.get("#select-input-year").click();
      cy.contains("li", "2010").click();
    });
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-input-gnfr").click();
      cy.contains("li", "Maatalous").click();
    });
    // wait until total emissions and legend are shown
    cy.contains("Valitun luokan osuus");
    cy.get(".legend-container").contains("Päästömäärä");
  });

  it("switches to layer: 2010 combined & typen oksidit)", () => {
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-input-gnfr").click();
      cy.contains("li", "Kokonaisp").click();
    });
    // wait until total emissions and legend are shown
    cy.contains("Päästöt yhteensä");
    cy.get(".legend-container").contains("Päästömäärä");
  });

  it("switches to layer: 2015 combined & rikkidioksidi", () => {
    // switch back to year 2018
    cy.get("#year-selector-div").within(() => {
      cy.get("#select-input-year").click();
      cy.contains("li", "2015").click();
    });
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-container-pollutant").click();
      cy.contains("Rikkidioksidi").click();
      cy.get("#selection-input-pollutant").should("have.value", "Rikkidioksidi");
    });
    // wait until total emissions and legend are shown
    cy.contains("Päästöt yhteensä");
    cy.get(".legend-container").contains("Päästömäärä");
  });
});

describe("Municipality CSV data downloads", () => {
  it("downloads CSV data of the selected municipality", () => {
    cy.get("#map-container").click(325, 525);
    cy.contains("(Rikkidioksidi)");
    cy.contains("Lataa päästödata").click();
    cy.wait(500);

    const filename = "paastodata_Kuopio.csv";
    const filePath = path.join(__dirname, "..", "csvDownloads", filename).substring(1);

    // check that file contains first row and
    cy.readFile(filePath).then((str) => {
      expect(str.length).to.above(10000);
      const firstRow = str.split("\n").shift();
      expect(firstRow.length).to.above(400);
      expect(firstRow).to.contain("Kuntanumero");
      expect(firstRow).to.contain("Hiilimonoksidi");
    });
  });
});

describe("Toggle back to grid data layer", () => {
  it("toggles grid data layer active again", () => {
    cy.contains("Ruudukko").click();
    cy.contains("Päästömäärä");
  });

  it("popups keep working", () => {
    cy.get("#map-container").click(325, 525);
    cy.contains("Rikkidioksidi (t):");
    cy.get(".olpopup-closer").click();
  });
});
