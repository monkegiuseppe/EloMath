import type { Problem } from './problems';

export const statisticsProblems: Problem[] = [
    // --- Basic Statistics (Mean, Median, Mode) (800-1100) ---
    {
        id: "STAT01",
        topic: "Mean",
        category: "Statistics",
        difficulty: 800,
        problem: "Find the arithmetic mean of the dataset: $\\{2, 5, 9, 12\\}$.",
        answer: "7"
    },
    {
        id: "STAT02",
        topic: "Median",
        category: "Statistics",
        difficulty: 850,
        problem: "Find the median of the dataset: $\\{3, 1, 8, 12, 5\\}$.",
        answer: "5"
    },
    {
        id: "STAT03",
        topic: "Median",
        category: "Statistics",
        difficulty: 900,
        problem: "Find the median of the dataset: $\\{10, 2, 5, 6\\}$.",
        answer: "5.5"
    },
    {
        id: "STAT04",
        topic: "Mode",
        category: "Statistics",
        difficulty: 800,
        problem: "Find the mode of the dataset: $\\{1, 2, 2, 3, 4\\}$.",
        answer: "2"
    },
    {
        id: "STAT05",
        topic: "Range",
        category: "Statistics",
        difficulty: 800,
        problem: "Find the range of the dataset: $\\{15, 2, 8, 20, 5\\}$.",
        answer: "18"
    },
    {
        id: "STAT06",
        topic: "Mean",
        category: "Statistics",
        difficulty: 950,
        problem: "If the mean of $\\{2, 4, x, 8\\}$ is 5, what is $x$?",
        answer: "6"
    },

    // --- Probability (900-1300) ---
    {
        id: "STAT_PROB01",
        topic: "Basic Probability",
        category: "Statistics",
        difficulty: 900,
        problem: "A fair 6-sided die is rolled. What is the probability of rolling a number greater than 4?",
        answer: "1/3"
    },
    {
        id: "STAT_PROB02",
        topic: "Independent Events",
        category: "Statistics",
        difficulty: 1000,
        problem: "Two fair coins are flipped. What is the probability of getting two heads?",
        answer: "0.25"
    },
    {
        id: "STAT_PROB03",
        topic: "Mutually Exclusive",
        category: "Statistics",
        difficulty: 1050,
        problem: "A card is drawn from a standard 52-card deck. What is the probability it is a King or a Queen?",
        answer: "2/13"
    },
    {
        id: "STAT_PROB04",
        topic: "Conditional Probability",
        category: "Statistics",
        difficulty: 1200,
        problem: "Given $P(A) = 0.5$, $P(B) = 0.4$, and $P(A \\cap B) = 0.2$, find $P(A|B)$.",
        answer: "0.5"
    },
    {
        id: "STAT_PROB05",
        topic: "Complement",
        category: "Statistics",
        difficulty: 950,
        problem: "The probability of rain is 0.3. What is the probability of no rain?",
        answer: "0.7"
    },

    // --- Combinatorics (1100-1500) ---
    {
        id: "STAT_COMB01",
        topic: "Factorial",
        category: "Statistics",
        difficulty: 1100,
        problem: "Calculate $5!$.",
        answer: "120"
    },
    {
        id: "STAT_COMB02",
        topic: "Permutations",
        category: "Statistics",
        difficulty: 1200,
        problem: "Calculate $P(5, 2)$ (permutations of 2 items from 5).",
        answer: "20"
    },
    {
        id: "STAT_COMB03",
        topic: "Combinations",
        category: "Statistics",
        difficulty: 1250,
        problem: "Calculate $C(5, 2)$ (combinations of 2 items from 5).",
        answer: "10"
    },
    {
        id: "STAT_COMB04",
        topic: "Combinations",
        category: "Statistics",
        difficulty: 1300,
        problem: "How many ways can a committee of 3 be chosen from 6 people?",
        answer: "20"
    },
    {
        id: "STAT_COMB05",
        topic: "Permutations",
        category: "Statistics",
        difficulty: 1350,
        problem: "How many distinct ways can the letters in the word 'DAD' be arranged?",
        answer: "3"
    },

    // --- Variance & Standard Deviation (1200-1600) ---
    {
        id: "STAT_VAR01",
        topic: "Variance (Population)",
        category: "Statistics",
        difficulty: 1300,
        problem: "Find the population variance $\\sigma^2$ of the dataset: $\\{1, 2, 3\\}$.",
        answer: "2/3"
    },
    {
        id: "STAT_VAR02",
        topic: "Standard Deviation",
        category: "Statistics",
        difficulty: 1350,
        problem: "Find the population standard deviation $\\sigma$ of the dataset: $\\{2, 4\\}$.",
        answer: "1"
    },
    {
        id: "STAT_VAR03",
        topic: "Variance",
        category: "Statistics",
        difficulty: 1400,
        problem: "If $E[X^2] = 50$ and $(E[X])^2 = 40$, what is $Var(X)$?",
        answer: "10"
    },

    // --- Distributions (1400-1800) ---
    {
        id: "STAT_DIST01",
        topic: "Z-Score",
        category: "Statistics",
        difficulty: 1400,
        problem: "Calculate the z-score for $x=12$ if $\\mu=10$ and $\\sigma=2$.",
        answer: "1"
    },
    {
        id: "STAT_DIST02",
        topic: "Binomial Expected Value",
        category: "Statistics",
        difficulty: 1500,
        problem: "For a binomial distribution $B(n, p)$ with $n=10$ and $p=0.5$, what is the expected value $E[X] = np$?",
        answer: "5"
    },
    {
        id: "STAT_DIST03",
        topic: "Binomial Variance",
        category: "Statistics",
        difficulty: 1600,
        problem: "For a binomial distribution with $n=20$ and $p=0.5$, what is the variance $\\sigma^2 = np(1-p)$?",
        answer: "5"
    },
    {
        id: "STAT_DIST04",
        topic: "Normal Distribution",
        category: "Statistics",
        difficulty: 1550,
        problem: "In a standard normal distribution ($Z \\sim N(0,1)$), what is the value of the mean?",
        answer: "0"
    },
    {
        id: "STAT_DIST05",
        topic: "Expected Value",
        category: "Statistics",
        difficulty: 1450,
        problem: "A random variable X takes value 1 with probability 0.4 and value 2 with probability 0.6. What is $E[X]$?",
        answer: "1.6"
    },
    // --- STATISTICS (Tier 3-4: ELO 800-1200) ---
    {
        category: "Statistics", id: "STAT_DESC_01", topic: "Mean", difficulty: 800,
        problem: "Find the mean of the set {2, 4, 6, 8, 10}.", answer: "6"
    },
    {
        category: "Statistics", id: "STAT_DESC_02", topic: "Median", difficulty: 850,
        problem: "Find the median of {1, 3, 10, 2, 5}.", answer: "3"
    },
    {
        category: "Statistics", id: "STAT_PROB_01", topic: "Simple Probability", difficulty: 850,
        problem: "A fair die is rolled. P(rolling > 4)? (Answer as decimal)", answer: "0.333"
    },
    {
        category: "Statistics", id: "STAT_PROB_02", topic: "Independent Events", difficulty: 1000,
        problem: "Two coins are flipped. P(both heads)? (Answer as decimal)", answer: "0.25"
    },
    {
        category: "Statistics", id: "STAT_COMB_01", topic: "Factorials", difficulty: 900,
        problem: "Evaluate 5!", answer: "120"
    },
    {
        category: "Statistics", id: "STAT_COMB_02", topic: "Permutations", difficulty: 1100,
        problem: "Calculate 5P2 (Permutation 5 pick 2).", answer: "20"
    },
    {
        category: "Statistics", id: "STAT_COMB_03", topic: "Combinations", difficulty: 1150,
        problem: "Calculate 5C2 (Combination 5 choose 2).", answer: "10"
    },
];