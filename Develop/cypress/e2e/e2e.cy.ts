import { mockState } from "../support/utils/helper";

// import { Responses } from "../support/types";

//each test becomes a context block

describe("Tech Quiz Cycle", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/questions/random", {
      statusCode: 200,
      body: mockState, // Using the mocked guess data
    }).as("getRandomQuestion");
    cy.visit("/");
  });

  context(
    "When the user clicks the start button then the quiz renders a question",
    () => {
      it("Renders a question when the start button is clicked", () => {
        // cy.get("body").invoke("html").then(console.log); // Log DOM content
        // cy.get("button").should("exist"); // Confirm button exists

        cy.get("button").contains("Start Quiz").click(); // Then click

        cy.wait("@getRandomQuestion")
          .its("response.statusCode")
          .should("eq", 200);
        cy.get("h2").should("contain", mockState[0].question);
      });
    }
  );

  context(
    "When a question is answered then the quiz renders another question",
    () => {
      it("Renders another question when the current question is answered", () => {
        cy.get("button").contains("Start Quiz").should("be.visible").click();
        cy.get("h2").should("contain", mockState[0].question);
        cy.get("button").contains("1").click();
        cy.get("h2").should("contain", mockState[1].question);
      });
    }
  );

  context("When the quiz is over then the user can view their score", () => {
    it("Displays the user's score when the quiz is over", () => {
      cy.get("button").contains("Start Quiz").should("be.visible").click();
      for (let i = 0; i < mockState.length; i++) {
        cy.get("button").contains("1").click();
      }
      cy.get("div.alert-success").should("contain", "Your score:");
    });
  });

  context("When the quiz is over then the user can start a new quiz", () => {
    it("Change text", () => {
      cy.get("button").contains("Start Quiz").should("be.visible").click();
      for (let i = 0; i < mockState.length; i++) {
        cy.get("button").contains("1").click();
      }
      cy.get("button").should("contain", "Take New Quiz").click();
      cy.get("div.alert-success").should("not.exist");
    });
  });
});

// GIVEN I am taking a tech quiz
// WHEN I click the start button
// THEN the quiz starts and I am presented with a question

//each test becomes a context block

// WHEN I answer a question
// THEN I am presented with another question

// WHEN all questions are answered
// THEN the quiz is over

// WHEN the quiz is over
// THEN I can view my score

// WHEN the quiz is over
// THEN I can start a new quiz
