import { mockState } from "../support/utils/helper";

// import { Responses } from "../support/types";

//each test becomes a context block

describe("Tech Quiz Cycle", () => {
  context(
    "When the user clicks the start button then the quiz renders a question",
    () => {
      beforeEach(() => {
        cy.intercept("GET", "/api/questions/random", {
          statusCode: 200,
          body: mockState, // Using the mocked guess data
        }).as("getRandomQuestion");

        // Visit the quiz page
        cy.visit("/");
      });

      it("Renders a question when the start button is clicked", () => {
        cy.get("body").invoke("html").then(console.log); // Log DOM content
        cy.get("button").should("exist"); // Confirm button exists

        cy.get("button").contains("Start Quiz").click(); // Then click

        cy.wait("@getRandomQuestion")
          .its("response.statusCode")
          .should("eq", 200);
        cy.get("h2").should("contain", mockState.question);
      });
    }
  );

  context(
    "When a question is answered then the quiz renders another question",
    () => {
      beforeEach(() => {
        cy.intercept("POST", "/api/questions/answer", {
          statusCode: 200,
          body: mockState, // Using the mocked guess data
        }).as("postAnswer");

        // Visit the quiz page and start the quiz
        cy.visit("/");
        cy.get("button").contains("Start Quiz").click();
        cy.wait("@getRandomQuestion");
      });

      it("Renders another question when the current question is answered", () => {
        cy.get("button").contains("Submit Answer").should("be.visible").click();
        cy.wait("@postAnswer").its("response.statusCode").should("eq", 200);
        cy.get("h2").should("contain", mockState.question);
      });
    }
  );

  context("When all questions are answered then the quiz is over", () => {});

  context("When the quiz is over then the user can view their score", () => {
    beforeEach(() => {
      cy.intercept("POST", "/api/questions/answer", {
        statusCode: 200,
        body: { ...mockState, isLastQuestion: true }, // Mocking the last question
      }).as("postAnswer");

      // Visit the quiz page and start the quiz
      cy.visit("/");
      cy.get("button").contains("Start Quiz").click();
      cy.wait("@getRandomQuestion");
    });

    it("Displays the user's score when the quiz is over", () => {
      cy.get("button").contains("Submit Answer").should("be.visible").click();
      cy.wait("@postAnswer").its("response.statusCode").should("eq", 200);
      cy.get("h2").should("contain", "Your Score");
      cy.get(".score").should("be.visible");
    });
  });

  context("When the quiz is over then the user can start a new quiz", () => {
    beforeEach(() => {
      cy.intercept("POST", "/api/questions/answer", {
        statusCode: 200,
        body: { ...mockState, isLastQuestion: true }, // Mocking the last question
      }).as("postAnswer");

      // Visit the quiz page and start the quiz
      cy.visit("/");
      cy.get("button").contains("Start Quiz").click();
      cy.wait("@getRandomQuestion");
    });

    it("Allows the user to start a new quiz when the quiz is over", () => {
      cy.get("button").contains("Submit Answer").should("be.visible").click();
      cy.wait("@postAnswer").its("response.statusCode").should("eq", 200);
      cy.get("button").contains("Start New Quiz").should("be.visible").click();
      cy.wait("@getRandomQuestion")
        .its("response.statusCode")
        .should("eq", 200);
      cy.get("h2").should("contain", mockState.question);
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
