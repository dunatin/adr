// ADR Quest - Master Application Engine (v3.0)

// ==========================================
// 1. ADVANCED CLINICAL DATA & STATE
// ==========================================

const DRUG_ADR_PAIRS = [
    { drug: "Penicillin", adr: "IgE Anaphylaxis", class: "Beta-lactam Antibiotic" },
    { drug: "Amiodarone", adr: "Pulmonary Fibrosis", class: "Antiarrhythmic Class III" },
    { drug: "Digoxin", adr: "Yellow-Green Xanthopsia", class: "Cardiac Glycoside" },
    { drug: "Heparin", adr: "Thrombocytopenia (HIT)", class: "Anticoagulant" },
    { drug: "Vancomycin", adr: "Red Man Syndrome", class: "Glycopeptide Antibiotic" },
    { drug: "Warfarin", adr: "Hemorrhagic Necrosis", class: "Vitamin K Antagonist" },
    { drug: "Gentamicin", adr: "Vestibular Ototoxicity", class: "Aminoglycoside" },
    { drug: "Metformin", adr: "Severe Lactic Acidosis", class: "Biguanide Antidiabetic" }
];

const DAILY_CHALLENGES = [
    {
        id: 1,
        question: "A patient taking Warfarin is started on Amiodarone. What is the primary pharmacokinetic concern regarding this drug-drug interaction?",
        options: [
            "Amiodarone inhibits CYP2C9, increasing Warfarin concentrations and bleed risk.",
            "Amiodarone induces renal clearance of Warfarin, reducing anticoagulant efficacy.",
            "Amiodarone blocks Warfarin protein binding, leading to immediate toxicity.",
            "There is no interaction; both can be administered concurrently at standard doses."
        ],
        correctIndex: 0,
        explanation: "Amiodarone is a potent inhibitor of CYP2C9, the primary enzyme responsible for metabolizing the active S-isomer of Warfarin. This inhibition significantly raises Warfarin serum levels, prolonging INR and increasing clinical bleeding risks."
    },
    {
        id: 2,
        question: "Which of the following clinical tools is most widely accepted to determine the causal relationship between a drug and an adverse event?",
        options: [
            "Glasgow Coma Scale",
            "Naranjo Algorithm (Adverse Drug Reaction Probability Scale)",
            "Wells Score for DVT",
            "Framingham Risk Score"
        ],
        correctIndex: 1,
        explanation: "The Naranjo Algorithm uses a questionnaire format (10 questions scoring de-challenge, re-challenge, placebo response) to calculate a causality score classifying the ADR as definite, probable, possible, or doubtful."
    },
    {
        id: 3,
        question: "Red Man Syndrome is a rate-dependent reaction associated with which medication infusion?",
        options: [
            "Gentamicin",
            "Ciprofloxacin",
            "Vancomycin",
            "Piperacillin-Tazobactam"
        ],
        correctIndex: 2,
        explanation: "Vancomycin-induced Red Man Syndrome is an anaphylactoid reaction caused by direct histamine release from mast cells when infused too rapidly. It is managed by slowing the infusion rate and administering antihistamines."
    }
];

const CLINICAL_CASES = [
    {
        id: 1,
        title: "The Dyspneic Arrhythmia Patient",
        category: "Cardiopulmonary Toxicity",
        vitalsStart: { hr: 64, bp: "115/70", temp: 36.8, o2: 89 },
        description: "A 68-year-old male presents with progressive shortness of breath, chronic non-productive cough, and blue-gray skin discoloration on his nose. He has been taking an antiarrhythmic drug for refractory atrial fibrillation for 9 months.",
        options: [
            { text: "Prescribe Azithromycin for suspected community-acquired pneumonia.", correct: false, explanation: "Incorrect. The blue-gray skin discoloration (ceruloderma) and chronic cough are classic hallmarks of Amiodarone toxicity, not simple bacterial pneumonia." },
            { text: "Discontinue Amiodarone immediately and order a high-resolution chest CT for suspected pulmonary toxicity.", correct: true, explanation: "Correct! Amiodarone-induced pulmonary toxicity is a life-threatening fibrosing alveolitis. Prompt drug withdrawal and CT diagnosis are required." },
            { text: "Increase the antiarrhythmic dosage to stabilize cardiovascular conduction.", correct: false, explanation: "Warning! Amiodarone accumulates heavily in tissues. Increasing the dose will severely worsen pulmonary fibrosis and toxicity." },
            { text: "Administer high-dose Albuterol nebulizers and send the patient home.", correct: false, explanation: "Incorrect. Albuterol does not address the underlying drug-induced lung remodeling and risks exacerbating tachyarrhythmia." }
        ],
        xpReward: 150
    },
    {
        id: 2,
        title: "The Bleeding Gums and Vision Halos",
        category: "Cardiac Glycoside Toxicity",
        vitalsStart: { hr: 45, bp: "98/55", temp: 36.5, o2: 96 },
        description: "A 75-year-old female with congestive heart failure complains of worsening nausea, abdominal pain, and seeing yellow-green halos around lights. Her ECG shows a salvaging junctional escape rhythm.",
        options: [
            { text: "Suspect Digoxin toxicity, check potassium, and administer Digoxin Immune Fab (Digibind).", correct: true, explanation: "Correct! Yellow-green vision changes, bradycardia, and GI upset are classic signs of Digoxin toxicity, especially in patients with deteriorating renal function. Digibind binds and neutralizes serum Digoxin." },
            { text: "Administer IV Metoprolol to resolve cardiac irritation.", correct: false, explanation: "Incorrect. Metoprolol is a beta-blocker that will further depress her dangerously low heart rate (45 bpm)." },
            { text: "Diagnose viral gastroenteritis and discharge with antiemetics.", correct: false, explanation: "Dangerous choice. Missing Digoxin toxicity risks fatal ventricular fibrillation due to cardiac hyper-irritability." },
            { text: "Prescribe furosemide to manage heart failure symptoms.", correct: false, explanation: "Incorrect. Loop diuretics lower potassium levels, which actually intensifies Digoxin binding to Na+/K+ ATPase, worsening toxicity." }
        ],
        xpReward: 150
    },
    {
        id: 3,
        title: "The Post-Operative Platelet Plunge",
        category: "Hematological Toxicity",
        vitalsStart: { hr: 95, bp: "135/85", temp: 37.2, o2: 95 },
        description: "A 54-year-old female post-hip replacement is receiving deep vein thrombosis prophylaxis. Her baseline platelet count was 250,000/µL. Today (Day 5 of therapy), her platelet count drops to 90,000/µL, and she has pain in her left calf.",
        options: [
            { text: "Order an urgent platelet transfusion to prevent bleeding.", correct: false, explanation: "Warning! Platelet transfusion in Heparin-Induced Thrombocytopenia (HIT) is contraindicated as it can fuel thrombosis." },
            { text: "Discontinue Heparin immediately and initiate an alternative anticoagulant like Argatroban.", correct: true, explanation: "Correct! The >50% drop in platelets within 5-10 days of Heparin exposure suggests HIT. Heparin must be stopped immediately, and direct thrombin inhibitors started to prevent arterial/venous thrombotic events." },
            { text: "Increase the Heparin infusion rate to treat the calf pain.", correct: false, explanation: "Dangerous. calf pain indicates a new clot secondary to HIT antibodies. Adding Heparin increases platelet activation and clotting." },
            { text: "Switch Heparin to Low Molecular Weight Heparin (Lovenox).", correct: false, explanation: "Incorrect. Lovenox cross-reacts almost 100% with HIT antibodies and will not stop the reaction." }
        ],
        xpReward: 150
    }
];

let MODULES_DATA = [
    {
        id: 1,
        title: "Introduction to Pharmacovigilance",
        description: "Explore the history of drug safety, the regulatory frameworks, and why adverse reaction reporting saves lives.",
        lessons: [
            { title: "Historical Context & Disasters", content: "Pharmacovigilance (PV) is defined as the science and activities relating to the detection, assessment, understanding, and prevention of adverse effects or any other drug-related problems. Historically, the field was triggered by catastrophic events. The most notable was the Thalidomide disaster of the late 1950s, where a drug marketed for morning sickness resulted in over 10,000 babies born with severe congenital limb malformations (phocomelia). This led directly to international mandates for clinical trials and post-marketing surveillance." },
            { title: "Underreporting Challenges", content: "Underreporting is the primary limitation of current spontaneous reporting networks (such as FDA MedWatch or the UK Yellow Card scheme). Studies show that only 1-10% of serious, hospital-inducing Adverse Drug Reactions (ADRs) are ever formally documented. The main barriers include clinical inertia (lack of time), fear of legal/litigation consequences, and uncertainty about whether the medication was the true biological cause." }
        ],
        quiz: [
            {
                question: "Which of the following historical events led to the enactment of the Kefauver-Harris Amendment of 1962, requiring proof of safety and efficacy?",
                options: ["The Sulfanilamide Elixir Tragedy", "The Thalidomide Disaster", "The Vioxx Cardiovascular Withdrawal", "The Tylenol Tampering Incident"],
                correctIndex: 1,
                explanation: "The Thalidomide disaster prompted major global regulatory reforms, including the Kefauver-Harris drug efficacy amendment in the United States."
            },
            {
                question: "What is the estimated percentage of serious, hospital-inducing ADRs that are actually reported to health regulatory bodies?",
                options: ["Less than 10%", "Around 25%", "Approximately 50%", "More than 75%"],
                correctIndex: 0,
                explanation: "Underreporting is a massive issue; it is estimated that less than 10% (commonly only 5%) of severe ADRs are formally reported."
            },
            {
                question: "Which of the following is defined as any untoward medical occurrence during treatment with a medicine, which does NOT necessarily have a causal relationship?",
                options: ["Adverse Drug Reaction (ADR)", "Adverse Event (AE)", "Side Effect", "Toxic Effect"],
                correctIndex: 1,
                explanation: "An Adverse Event (AE) is any medical occurrence during drug therapy, regardless of whether a causal relationship is suspected or established."
            },
            {
                question: "The primary objective of signal detection in pharmacovigilance is to detect:",
                options: ["Manufacturing defects only", "Previously unknown or poorly documented drug-adverse effect associations", "Dosage compliance rates", "Immediate allergic reactions during Phase 1 trials"],
                correctIndex: 1,
                explanation: "Signal detection aims to discover new safety signals (previously unknown hazards) in large patient populations using statistical analysis."
            },
            {
                question: "Spontaneous reporting databases are primarily useful for catching which type of reaction?",
                options: ["Extremely rare, idiosyncratic, or long-term delayed toxicities", "Predictable Type A medication dosage errors", "Expected clinical efficacy rates", "Standard drug-food absorption interactions"],
                correctIndex: 0,
                explanation: "Because spontaneous databases cover massive patient populations, they excel at highlighting rare or delayed toxicities that clinical trials with smaller patient groups miss."
            }
        ]
    },
    {
        id: 2,
        title: "Mechanisms of ADR Classifications",
        description: "Master the Rawlins-Thompson classification systems of adverse reactions (Type A to Type F).",
        lessons: [
            { title: "Type A (Augmented) vs Type B (Bizarre)", content: "The Rawlins-Thompson classification separates reactions by their pharmacological predictability. Type A (Augmented) reactions are dose-dependent, predictable based on the drug's primary action, common, and usually resolve with a dosage reduction. Examples include bradycardia from beta-blockers or hypoglycemia from insulin. Type B (Bizarre) reactions are unpredictable, dose-independent, rare, and carry a high mortality rate. They are usually immune-mediated (hypersensitivity) or genetic (idiosyncratic). Examples include anaphylaxis from penicillin or severe skin exfoliation (SJS) from carbamazepine." },
            { title: "Type C to Type F Classifications", content: "The expanded classification covers: Type C (Chronic/Continuous), which is related to cumulative dose over long periods (e.g., hypothalamic-pituitary-adrenal axis suppression by corticosteroids); Type D (Delayed), which manifests long after exposure (e.g., tardive dyskinesia or secondary malignancies); Type E (End of Use), which occurs during withdrawal or cessation (e.g., rebound hypertension from clonidine); and Type F (Failure), which involves unexpected therapeutic failure (e.g., oral contraceptive failure due to enzyme induction by rifampin)." }
        ],
        quiz: [
            {
                question: "An adverse event characterized by insulin-induced hypoglycemia is classified under which Rawlins-Thompson category?",
                options: ["Type A (Augmented)", "Type B (Bizarre)", "Type C (Chronic)", "Type E (End-of-use)"],
                correctIndex: 0,
                explanation: "Hypoglycemia is an extension of insulin's blood-sugar-lowering effect, making it predictable, dose-dependent, and thus Type A."
            },
            {
                question: "Which type of reaction is characterized by being completely dose-independent, rare, unpredictable, and highly severe?",
                options: ["Type A", "Type B", "Type C", "Type D"],
                correctIndex: 1,
                explanation: "Type B (Bizarre) reactions are immunologic or idiosyncratic, meaning they occur regardless of dose and are highly unpredictable."
            },
            {
                question: "A patient experiences rebound hypertension after abruptly stopping their antihypertensive medication (Clonidine). What reaction type is this?",
                options: ["Type C", "Type D", "Type E", "Type F"],
                correctIndex: 2,
                explanation: "Type E (End-of-use) reactions occur when a drug therapy is abruptly ceased, manifesting as withdrawal or rebound effects."
            },
            {
                question: "Therapeutic failure of oral contraceptives when co-administered with Rifampin (an enzyme inducer) is classified as:",
                options: ["Type A", "Type B", "Type E", "Type F"],
                correctIndex: 3,
                explanation: "Type F (Failure of therapy) describes reactions where a drug fails to produce its intended therapeutic effect due to factors like drug interactions."
            },
            {
                question: "The development of secondary acute leukemia years after completing chemotherapy with an alkylating agent represents which reaction type?",
                options: ["Type A", "Type B", "Type C", "Type D"],
                correctIndex: 3,
                explanation: "Secondary malignancies or genetic mutations appearing long after drug exposure are typical Type D (Delayed) adverse reactions."
            }
        ]
    },
    {
        id: 3,
        title: "High-Risk Drug Classes",
        description: "Learn to identify high-alert medications that account for the majority of severe hospitalizations.",
        lessons: [
            { title: "High-Alert Medications", content: "High-alert medications are drugs that bear a heightened risk of causing significant patient harm when used in error. The Institute for Safe Medication Practices (ISMP) highlights anticoagulants, insulins, chemotherapy agents, and opioids as the leading classes of high-alert hospital errors." },
            { title: "Narrow Therapeutic Index (NTI)", content: "NTI drugs are agents where small differences in dose or blood concentration may lead to serious therapeutic failures or life-threatening adverse drug reactions. Examples include Digoxin (risk of xanthopsia/yellow-green vision and AV block), Lithium (risk of tremors, ataxia, and renal damage), and Gentamicin (risk of ototoxicity and acute tubular necrosis). These drugs require clinical Therapeutic Drug Monitoring (TDM) to keep plasma levels in safe ranges." }
        ],
        quiz: [
            {
                question: "Which of the following medication classes is consistently ranked among the highest for outpatient drug-induced emergency room visits?",
                options: ["Statins", "Anticoagulants", "Proton Pump Inhibitors", "Beta-blockers"],
                correctIndex: 1,
                explanation: "Anticoagulants (like Warfarin, DOACs, Heparin) carry high bleed risks and account for a major portion of outpatient safety emergencies."
            },
            {
                question: "Which drug is a classic example of a Narrow Therapeutic Index (NTI) agent requiring serum concentration monitoring?",
                options: ["Amoxicillin", "Digoxin", "Atorvastatin", "Metformin"],
                correctIndex: 1,
                explanation: "Digoxin has a very narrow therapeutic range (0.5-2.0 ng/mL). Higher doses cause severe cardiotoxicity and neurological symptoms."
            },
            {
                question: "A patient on Gentamicin therapy starts complaining of tinnitus and loss of balance. What is the suspected mechanism?",
                options: ["Type A aminoglycoside-induced vestibulotoxicity", "Type B genetic liver necrosis", "Type C cumulative bone density loss", "Type F drug failure"],
                correctIndex: 0,
                explanation: "Gentamicin accumulates in the endolymph of the inner ear, causing damage to sensory hair cells, which presents as ototoxicity and balance loss."
            },
            {
                question: "What therapeutic strategy is essential for ensuring safety with Narrow Therapeutic Index drugs like Lithium or Phenytoin?",
                options: ["Double dosage intervals", "Therapeutic Drug Monitoring (TDM)", "Co-administration with an antihistamine", "Visual acuity testing only"],
                correctIndex: 1,
                explanation: "Therapeutic Drug Monitoring (TDM) involves measuring drug blood levels at specific intervals to keep them within therapeutic limits."
            },
            {
                question: "Lithium toxicity is severely exacerbated by which patient condition or drug co-administration?",
                options: ["High sodium intake", "Dehydration or use of Thiazide Diuretics", "Vitamin C supplements", "Co-administration with penicillin"],
                correctIndex: 1,
                explanation: "Thiazide diuretics promote sodium excretion, which causes the kidneys to reabsorb lithium instead of sodium, rapidly inducing lithium toxicity."
            }
        ]
    },
    {
        id: 4,
        title: "Vulnerable Patient Populations",
        description: "Assess safety parameters for neonates, geriatrics, pregnancy, and polypharmacy patients.",
        lessons: [
            { title: "Geriatrics & The Beers Criteria", content: "Elderly patients represent the highest risk population for ADRs due to age-related physiological changes. They experience decreased glomerular filtration rate (GFR), leading to drug accumulation; increased body fat percentage, which extends the half-life of lipophilic drugs (like diazepam); and reduced homeostatic reserves. The American Geriatrics Society (AGS) publishes the Beers Criteria, a guidelines list detailing medications that are potentially inappropriate for older adults due to high falls, confusion, or GI bleed risks." },
            { title: "Pediatric & Neonatal Safety", content: "Neonates have immature metabolic pathways, specifically glucuronidation (phase II metabolism). This developmental deficit is famously demonstrated by Grey Baby Syndrome, where administration of Chloramphenicol to newborns leads to drug accumulation, cardiovascular collapse, and a characteristic gray skin discoloration. Renal clearance is also highly reduced in newborns, requiring dosage calculations based on body surface area rather than simple scaling." }
        ],
        quiz: [
            {
                question: "Which physiological change in geriatric patients leads to prolonged half-lives of lipophilic drugs like Benzodiazepines?",
                options: ["Increased total body water", "Decreased total body fat", "Increased body fat percentage", "Increased glomerular filtration rate"],
                correctIndex: 2,
                explanation: "Age-associated increases in adipose tissue (body fat) act as a reservoir for fat-soluble drugs, prolonging their elimination half-life."
            },
            {
                question: "What clinical guideline lists drugs that are potentially inappropriate for use in older adults due to adverse risk profiles?",
                options: ["The Naranjo Criteria", "The Beers Criteria", "The Gold Standard index", "The MedWatch list"],
                correctIndex: 1,
                explanation: "The Beers Criteria is a standardized list of medications older adults should avoid or use with caution due to fall, delirium, or bleed risks."
            },
            {
                question: "Grey Baby Syndrome is caused by an immature metabolic pathway in neonates exposed to which medication?",
                options: ["Penicillin G", "Chloramphenicol", "Gentamicin", "Sulfamethoxazole"],
                correctIndex: 1,
                explanation: "Chloramphenicol accumulation due to deficient glucuronidation in newborns causes mitochondrial toxicity and circulatory collapse."
            },
            {
                question: "A patient carrying the HLA-B*1502 gene variant is at high risk of Stevens-Johnson Syndrome if exposed to:",
                options: ["Abacavir", "Carbamazepine", "Allopurinol", "Warfarin"],
                correctIndex: 1,
                explanation: "The HLA-B*1502 allele (common in Asian populations) strongly pre-disposes patients to severe cutaneous adverse reactions like SJS when taking carbamazepine."
            },
            {
                question: "Which genetic testing is recommended by the FDA before prescribing the antiretroviral drug Abacavir to avoid fatal hypersensitivity?",
                options: ["CYP2C19 testing", "HLA-B*5701 screening", "TPMT enzyme analysis", "G6PD deficiency panel"],
                correctIndex: 1,
                explanation: "HLA-B*5701 genetic testing is mandatory before starting Abacavir, as individuals carrying this allele have a near 100% risk of multi-organ hypersensitivity."
            }
        ]
    },
    {
        id: 5,
        title: "Clinical Detection & Causality",
        description: "Use clinical methods and causality algorithms (like Naranjo) to verify medication etiology.",
        lessons: [
            { title: "The Naranjo Algorithm", content: "Causality assessment is the method used to estimate the probability that a specific drug caused an adverse event. The Naranjo Algorithm is a 10-question questionnaire. Points are awarded or deducted based on: temporal sequence (did the reaction occur after the drug?), de-challenge (did it improve when stopped?), re-challenge (did it recur when restarted?), alternative causes, and objective confirmation. Scores represent: 9+ (Definite), 5-8 (Probable), 1-4 (Possible), and <=0 (Doubtful)." },
            { title: "De-challenge & Re-challenge Dynamics", content: "De-challenge is the deliberate discontinuation of a drug. A positive de-challenge occurs when the adverse symptoms subside. Re-challenge is the re-introduction of the drug. A positive re-challenge occurs when symptoms return. While re-challenge provides definitive proof of causality, it is clinically contraindicated in severe or life-threatening reactions (e.g., SJS, anaphylaxis, liver failure) due to ethical concerns." }
        ],
        quiz: [
            {
                question: "A Naranjo score of 7 classifies the causal relationship between a drug and an adverse event as:",
                options: ["Definite", "Probable", "Possible", "Doubtful"],
                correctIndex: 1,
                explanation: "Naranjo scores between 5 and 8 are classified as Probable causality."
            },
            {
                question: "Under what circumstance is performing a drug re-challenge strictly contraindicated?",
                options: ["Mild cutaneous rash", "Severe drug-induced anaphylaxis or organ failure", "Predictable Type A headache", "Therapeutic drug failure"],
                correctIndex: 1,
                explanation: "Re-challenging a patient who suffered a life-threatening hypersensitivity (like anaphylaxis) is highly dangerous and ethically forbidden."
            },
            {
                question: "Which parameter of causality assessment checks if the adverse reaction could be explained by the patient's underlying disease?",
                options: ["De-challenge", "Alternative causes", "Re-challenge", "Temporal relationship"],
                correctIndex: 1,
                explanation: "Investigating alternative causes ensures we are not attributing a disease progression symptom to a newly introduced drug."
            },
            {
                question: "In the Naranjo Algorithm, if a reaction occurs after the drug is administered, what score is added for temporal sequence?",
                options: ["-1 point", "0 points", "+1 point", "+2 points"],
                correctIndex: 2,
                explanation: "A positive temporal relationship (the event follows drug administration) adds +1 point to the algorithm score."
            },
            {
                question: "If a patient's ADR improves when administered a specific antagonist (like Naloxone for Opioids), how does it affect the Naranjo score?",
                options: ["No points are added", "It adds +1 point as objective verification of drug relationship", "It deducts -2 points", "It resets the score to zero"],
                correctIndex: 1,
                explanation: "Antagonizing the drug's effect with a receptor blocker which resolves symptoms provides objective proof of drug causation, adding +1 point."
            }
        ]
    },
    {
        id: 6,
        title: "Safety Reporting & Standards",
        description: "Practice the workflow of logging adverse reports with national databases (FDA, EMA).",
        lessons: [
            { title: "MedWatch & Spontaneous Reporting", content: "Spontaneous reporting is the cornerstone of pharmacovigilance. In the United States, the Food and Drug Administration (FDA) operates MedWatch, a voluntary portal for clinicians and patients to report serious adverse events, product quality problems, and therapeutic failures. In the United Kingdom, this is managed by the MHRA's Yellow Card Scheme. Reports feed into global aggregate databases like VigiBase, maintained by the Uppsala Monitoring Centre." },
            { title: "Critical Data Requirements", content: "A high-quality adverse reaction report requires four essential elements to be scientifically valid: 1) An identifiable patient (age, gender, initials); 2) A suspect medical product; 3) A clear description of the adverse reaction; and 4) An identifiable reporter. Lacking any of these elements prevents causality profiling and database parsing." }
        ],
        quiz: [
            {
                question: "What database is maintained by the WHO Collaborating Centre (Uppsala Monitoring Centre) to aggregate global adverse drug reports?",
                options: ["MedWatch", "Yellow Card", "VigiBase", "ClinicalTrials.gov"],
                correctIndex: 2,
                explanation: "VigiBase is the WHO's unique global database of individual case safety reports, compiling millions of reports from over 130 countries."
            },
            {
                question: "Which of the following is NOT one of the four essential components required to submit a valid ADR report?",
                options: ["Identifiable patient", "Suspect product", "Description of reaction", "Patient's insurance provider details"],
                correctIndex: 3,
                explanation: "Insurance details are irrelevant for clinical safety profiling; only the patient, drug, reaction, and reporter are required."
            },
            {
                question: "What is the primary objective of spontaneous reporting networks in post-marketing safety?",
                options: ["Enforcing dosage calculations", "Identifying rare, long-term, or delayed drug safety signals", "Replacing clinical trial testing", "Managing drug distribution chains"],
                correctIndex: 1,
                explanation: "Spontaneous reports gather data from massive, diverse real-world populations to catch rare side effects missed in limited clinical trials."
            },
            {
                question: "UK clinicians report suspected adverse events to the MHRA using what reporting scheme?",
                options: ["Yellow Card Scheme", "MedWatch Portal", "VigiBase Network", "Vance Registry"],
                correctIndex: 0,
                explanation: "The Yellow Card Scheme is the UK system for collecting and monitoring information on suspected safety issues with medicines."
            },
            {
                question: "Under MedWatch guidelines, a serious adverse event is defined as one that results in which outcome?",
                options: ["Any mild stomach upset", "Hospitalization, disability, congenital anomaly, or death", "Therapeutic product packaging defect only", "A class-action lawsuit"],
                correctIndex: 1,
                explanation: "Seriousness is defined by outcomes: death, life-threatening events, inpatient hospitalization (or prolongation), persistent disability, or birth defects."
            }
        ]
    },
    {
        id: 7,
        title: "Prevention & Risk Mitigation",
        description: "Study how safety checklists, clinical decision software, and education systems reduce ADRs.",
        lessons: [
            { title: "REMS Programs", content: "Risk Evaluation and Mitigation Strategies (REMS) are specialized safety programs mandated by the FDA for medications with exceptionally high toxic risks. These programs require healthcare providers, pharmacists, and patients to satisfy specific criteria before a drug can be prescribed or dispensed. For example, patients on Clozapine (an antipsychotic with a risk of severe neutropenia) must undergo regular Absolute Neutrophil Count (ANC) blood tests, logged in a central registry, to receive their supply." },
            { title: "Clinical Support Systems & Reconciliation", content: "Medication errors are a primary cause of preventable ADRs. Computerized Physician Order Entry (CPOE) systems integrated with clinical decision support provide real-time alerts for drug-drug interactions, patient allergies, and weight-based dosage warnings. However, excessive alerts can lead to 'alert fatigue,' causing clinicians to override warnings. Medication Reconciliation—the formal process of creating an accurate list of all medications a patient is taking and comparing it against admission orders—is critical during transitions of care." }
        ],
        quiz: [
            {
                question: "What FDA safety program mandates specialized registrations or blood tests before high-risk drugs can be dispensed?",
                options: ["REMS", "Fast Track Approval", "MedWatch Registry", "Beers Protocols"],
                correctIndex: 0,
                explanation: "Risk Evaluation and Mitigation Strategies (REMS) enforce critical diagnostic steps (like blood draws) to manage known severe drug risks."
            },
            {
                question: "What is a primary danger associated with electronic prescribing alerts in modern healthcare systems?",
                options: ["Complete system crashes", "Alert fatigue causing clinicians to override critical safety warnings", "Under-dosing all patients", "Increasing reporting timelines"],
                correctIndex: 1,
                explanation: "Alert fatigue occurs when clinicians receive too many low-priority warnings, causing them to ignore or override major warnings."
            },
            {
                question: "Which of the following processes compares a patient's home medication list against admission or discharge orders to prevent errors?",
                options: ["Therapeutic Drug Monitoring", "Medication Reconciliation", "Naranjo causation scoring", "Signal detection monitoring"],
                correctIndex: 1,
                explanation: "Medication Reconciliation resolves discrepancies at transitions of care, preventing duplicate therapies and drug-drug interactions."
            },
            {
                question: "Under the Clozapine REMS registry, what laboratory value must be routinely checked to prevent fatal agranulocytosis?",
                options: ["Serum Creatinine", "Absolute Neutrophil Count (ANC)", "Liver Transaminases", "Prothrombin Time (INR)"],
                correctIndex: 1,
                explanation: "Clozapine can cause severe neutropenia (agranulocytosis). Patients must have their Absolute Neutrophil Count (ANC) verified."
            },
            {
                question: "Which clinical safety workflow is commonly used to prevent chemotherapy dosing errors?",
                options: ["Single-doctor signoff", "Independent double-checks by two oncology-certified providers", "Weekly serum monitoring", "Using a Naranjo causal checklist"],
                correctIndex: 1,
                explanation: "High-alert drugs like chemotherapy require independent double-checks where two practitioners separately verify the patient, dosage calculations, and infusion pump parameters."
            }
        ]
    },
    {
        id: 8,
        title: "Complex Case Studies & Signal Detection",
        description: "Synthesize all clinical guidelines to analyze real-world polypharmacy and safety cases.",
        lessons: [
            { title: "The 'Triple Whammy' Interaction", content: "A classic and dangerous drug-drug-disease interaction occurs when an ACE inhibitor (or ARB), a diuretic, and a non-steroidal anti-inflammatory drug (NSAID) are co-administered. This combination is known as the 'Triple Whammy' and frequently precipitates acute kidney injury (AKI). Mechanism: 1) Diuretics reduce intravascular volume; 2) NSAIDs inhibit prostaglandins, constricting the afferent arteriole; 3) ACE inhibitors inhibit angiotensin II, dilating the efferent arteriole. This results in a severe drop in glomerular filtration pressure." },
            { title: "Serotonin Syndrome Diagnosis", content: "Serotonin Syndrome is a predictable, drug-induced condition resulting from hyper-serotonergic state in the synapses. It frequently occurs when multiple serotonergic drugs are combined (e.g., SSRIs, MAOIs, Tramadol, Linezolid). Diagnostic criteria (like the Hunter Criteria) check for neuromuscular excitation (clonus, hyperreflexia, tremors), autonomic instability (hyperthermia, tachycardia), and altered mental status. Managing this ADR requires discontinuing all serotonergic drugs, supportive care, and administering serotonin antagonists like cyproheptadine." }
        ],
        quiz: [
            {
                question: "The 'Triple Whammy' interaction that induces acute kidney injury involves which three drug classes?",
                options: [
                    "ACE inhibitor + Diuretic + NSAID",
                    "Beta-blocker + Calcium channel blocker + Statin",
                    "Insulin + Metformin + Sulfonylurea",
                    "Opioid + Benzodiazepine + Antihistamine"
                ],
                correctIndex: 0,
                explanation: "An ACE inhibitor, a diuretic, and an NSAID combined restrict kidney perfusion pressure, severely reducing GFR and leading to AKI."
            },
            {
                question: "Which of the following clinical signs is a diagnostic hallmark of Serotonin Syndrome under the Hunter Criteria?",
                options: ["Severe flaccid paralysis", "Spontaneous or inducible clonus (muscle contractions)", "Hypothermia", "Acute bradycardia"],
                correctIndex: 1,
                explanation: "Neuromuscular excitation, particularly clonus (spontaneous, inducible, or ocular), is a diagnostic indicator of Serotonin Syndrome."
            },
            {
                question: "Hy's Law is a prognostic rule of thumb indicating a high risk of fatal liver failure. It checks for drug-induced liver injury combined with:",
                options: ["Low potassium", "Elevated transaminases and jaundice without biliary obstruction", "Renal failure indicators", "Thrombocytopenia"],
                correctIndex: 1,
                explanation: "Hy's Law holds that drug-induced liver injury (transaminases >3x ULN) paired with jaundice (bilirubin >2x ULN) has a 10-50% mortality rate."
            },
            {
                question: "Which agent can act as a serotonergic drug and trigger Serotonin Syndrome when combined with an SSRI?",
                options: ["Linezolid (Oxazolidinone Antibiotic)", "Amoxicillin", "Atorvastatin", "Lisinopril"],
                correctIndex: 0,
                explanation: "Linezolid is a weak, reversible monoamine oxidase inhibitor (MAOI). Combining it with an SSRI significantly increases serotonin levels."
            },
            {
                question: "Managing severe Serotonin Syndrome involves drug withdrawal, cooling measures, and which pharmacotherapy antagonist?",
                options: ["Naloxone", "Flumazenil", "Cyproheptadine", "Protamine Sulfate"],
                correctIndex: 2,
                explanation: "Cyproheptadine is a first-generation antihistamine with potent 5-HT1A and 5-HT2A receptor antagonist activity, used to treat severe serotonin toxicity."
            }
        ]
    },
    {
        id: 9,
        title: "Medical Informatics & Safety Databases",
        description: "Study how electronic medical records and big data analytics drive post-market surveillance.",
        lessons: [
            { title: "EMR Alerts & Automated Tracking", content: "Electronic Medical Records (EMRs) are not just databases; they are tools for active pharmacovigilance. Algorithms scan patient charts for clinical triggers, such as a sharp rise in Serum Creatinine within 48 hours of starting an aminoglycoside, throwing immediate alerts to safety pharmacists." },
            { title: "Big Data & Machine Learning in PV", content: "Natural Language Processing (NLP) models scan clinical trial transcripts and unstructured doctor notes to extract potential drug safety warnings. Disproportionality analysis runs on massive registries (like the FDA FAERS) to find statistically high reporting odds ratios (ROR) for drug-adverse event pairs." }
        ],
        quiz: [
            {
                question: "What technology is used to mine unstructured clinical physician notes for potential drug side effect signals?",
                options: ["Blockchain validation", "Natural Language Processing (NLP)", "Digital sorting filters", "Spontaneous yellow card registers"],
                correctIndex: 1,
                explanation: "Natural Language Processing (NLP) allows computers to read and extract clinical entities (like drugs and side effects) from narrative text."
            },
            {
                question: "In database mining, a Reporting Odds Ratio (ROR) is primarily used to measure:",
                options: ["Medication dosing compliance", "Statistical disproportionality indicating a potential safety signal", "Drug development cost projections", "Patient mortality rates only"],
                correctIndex: 1,
                explanation: "ROR compares the reporting rate of a specific ADR for a drug against all other drugs in a database. High ROR flags potential safety signals."
            },
            {
                question: "Active surveillance in pharmacovigilance differs from passive spontaneous reporting in that it:",
                options: ["Relies on patients calling in", "Systematically tracks patient charts or outcomes in real-time", "Is completely unregulated", "Is done only during Phase 1 trials"],
                correctIndex: 1,
                explanation: "Active surveillance actively monitors patient outcomes (e.g. searching EHRs for renal failure triggers) rather than waiting for voluntary reporting."
            },
            {
                question: "Which database is the primary U.S. repository for FDA spontaneous adverse event reports?",
                options: ["FAERS", "VigiBase", "ClinicalTrials.gov", "PubMed"],
                correctIndex: 0,
                explanation: "FAERS (FDA Adverse Event Reporting System) is the primary U.S. database collecting spontaneous safety logs."
            },
            {
                question: "EHR-integrated safety algorithms that alert providers about critical lab values (e.g., potassium drops) help prevent which issue?",
                options: ["Under-prescribing", "Severe drug-disease contraindications or toxicities", "Billing errors", "Spontaneous signal detection alerts"],
                correctIndex: 1,
                explanation: "EMR alert rules detect high-risk scenarios (like giving a potassium-wasting diuretic to a hypokalemic patient) before drug administration."
            }
        ]
    },
    {
        id: 10,
        title: "Pharmacoeconomics & The Cost of ADRs",
        description: "Analyze the severe financial and resource burden medication toxicities impose on health systems.",
        lessons: [
            { title: "Direct Hospital & ICU Costs", content: "ADRs are a leading cause of hospital admissions, representing 5-7% of all acute care beds. Once hospitalized, a patient suffering an adverse event stays an average of 2-5 days longer, incurring massive direct costs in ICU resources, lab diagnostics, and therapeutic counter-agents." },
            { title: "Cost-Benefit of Safety Investments", content: "Pharmacoeconomic models evaluate if investing in safety systems (like barcoded administration or clinical pharmacists) outweighs the cost of treatment. Proactive reconciliation programs regularly demonstrate a positive return on investment (ROI) by preventing critical injuries." }
        ],
        quiz: [
            {
                question: "Approximately what percentage of all acute care hospital admissions are direct results of adverse drug events?",
                options: ["Less than 1%", "5% to 7%", "15% to 20%", "More than 30%"],
                correctIndex: 1,
                explanation: "Clinical statistics show that 5% to 7% of general hospital admissions are caused directly by severe adverse events."
            },
            {
                question: "Which of the following is considered an indirect cost of a severe adverse drug reaction?",
                options: ["ICU room charge", "Loss of patient productivity and income during recovery", "Antidote drug cost", "Lab test fees"],
                correctIndex: 1,
                explanation: "Indirect costs measure lost productivity, wage losses, and caregiver burdens, whereas direct costs measure immediate clinical fees."
            },
            {
                question: "What pharmacoeconomic method evaluates safety measures by comparing implementation costs directly against saved clinical treatment costs?",
                options: ["Cost-Benefit Analysis", "Causality scoring index", "Naranjo probability ratio", "Signal mining analysis"],
                correctIndex: 0,
                explanation: "Cost-Benefit Analysis converts all inputs and outcomes (prevented ADRs) into monetary terms to evaluate return on investment (ROI)."
            },
            {
                question: "The introduction of Barcoded Medication Administration (BCMA) systems in hospitals is economically justified because it:",
                options: ["Lowers nursing wages", "Drastically reduces high-cost dispensing and administration errors", "Shortens clinic shifts", "Eliminates spontaneous reporting"],
                correctIndex: 1,
                explanation: "BCMA verifies patient identity and drug doses at the bedside, preventing costly administration errors and associated clinical treatments."
            },
            {
                question: "A prescribing cascade increases healthcare costs because:",
                options: ["It reduces drug prices", "A second drug is prescribed to treat the side effects of the first drug, misdiagnosed as a new condition", "It eliminates the need for lab monitoring", "It shortens hospital stays"],
                correctIndex: 1,
                explanation: "Prescribing cascades result in unnecessary therapies, drug-drug interactions, and admissions, driving up patient care costs."
            }
        ]
    },
    {
        id: 11,
        title: "Vaccine Safety & Biologicals",
        description: "Assess unique clinical monitoring parameters for immunotherapies, vaccines, and monoclonal antibodies.",
        lessons: [
            { title: "Immunogenicity & Biological ADRs", content: "Biologicals (like monoclonal antibodies) differ from small-molecule drugs. They can induce immunogenicity—the creation of anti-drug antibodies (ADAs)—which can neutralize therapeutic efficacy or cause severe infusion-related hypersensitivity or Cytokine Release Syndrome (CRS)." },
            { title: "Vaccine Adverse Event Reporting System (VAERS)", content: "Vaccine safety requires specialized spontaneous surveillance systems. In the U.S., VAERS is co-administered by the FDA and CDC. Because vaccines are administered to healthy populations, safety monitoring demands rapid signal analysis for Adverse Events of Special Interest (AESIs)." }
        ],
        quiz: [
            {
                question: "Biological therapeutics like monoclonal antibodies can induce the immune system to produce:",
                options: ["Enzyme inductors", "Anti-Drug Antibodies (ADAs)", "Serum creatinine cells", "Beers proteins"],
                correctIndex: 1,
                explanation: "ADAs neutralize biological drugs, reducing clinical efficacy and risking severe hypersensitivity or serum sickness."
            },
            {
                question: "Which program is the primary U.S. surveillance system dedicated specifically to vaccine post-marketing safety?",
                options: ["FAERS", "VAERS", "REMS", "VigiBase"],
                correctIndex: 1,
                explanation: "VAERS (Vaccine Adverse Event Reporting System) collects voluntary reports of adverse events following immunization."
            },
            {
                question: "What acute, systemic inflammatory response characterized by high fever and multi-organ dysfunction can occur after biological immunotherapies?",
                options: ["Cytokine Release Syndrome (CRS)", "Lactic Acidosis", "Vestibular Ototoxicity", "Xanthopsia"],
                correctIndex: 0,
                explanation: "CRS occurs when immune cells release massive cytokines, commonly following monoclonal antibody infusions or CAR-T cell therapies."
            },
            {
                question: "Vaccine safety monitoring is particularly sensitive because vaccines are administered to:",
                options: ["Geriatric patients only", "Primarily healthy populations for disease prevention", "Terminally ill patients", "Animals during Phase 4 trials"],
                correctIndex: 1,
                explanation: "Since vaccines are preventive measures given to healthy individuals, tolerance for serious adverse events is exceptionally low."
            },
            {
                question: "Which of the following is defined as a vaccine-specific 'adverse event of special interest' (AESI) monitored post-licensing?",
                options: ["Mild injection site soreness", "Guillain-Barré Syndrome (GBS)", "Standard drug failure", "Transient mild headache"],
                correctIndex: 1,
                explanation: "GBS is a rare neurological disorder monitored closely as an AESI following certain immunizations."
            }
        ]
    },
    {
        id: 12,
        title: "Professional Ethics & Clinical Practice",
        description: "Study safety cultures, medication error disclosure, and interprofessional patient protection.",
        lessons: [
            { title: "Error Disclosure & The 'Just Culture'", content: "Historically, medication errors were punished, leading to concealment. Modern healthcare advocates a 'Just Culture'—differentiating between human errors (addressed via system changes) and reckless behaviors. Clinicians are ethically obligated to disclose medication errors and ADR events directly to patients." },
            { title: "Root Cause Analysis (RCA)", content: "When a severe medication error or preventable ADR occurs, clinical teams perform a Root Cause Analysis (RCA). RCA is a structured retrospect safety check identifying underlying systemic failures (e.g. look-alike labeling, staffing shortages) rather than focusing blame on individual staff members." }
        ],
        quiz: [
            {
                question: "A 'Just Culture' in healthcare safety is best defined as one that:",
                options: [
                    "Punishes all clinical errors immediately to ensure compliance",
                    "Distinguishes between unintentional human errors (system failures) and reckless behaviors",
                    "Ignores all safety violations to prevent litigation",
                    "Requires patients to verify all medications"
                ],
                correctIndex: 1,
                explanation: "Just Culture encourages voluntary error reporting by focusing on system issues, while maintaining accountability for reckless violations."
            },
            {
                question: "What retrospective safety tool is used by clinical teams to investigate systemic failures after a severe ADR or error occurs?",
                options: ["Naranjo scoring scale", "Root Cause Analysis (RCA)", "Beers Criteria review", "Active signal database mining"],
                correctIndex: 1,
                explanation: "RCA maps out the timeline of events to discover system errors (like look-alike drug storage) that allowed the mistake to occur."
            },
            {
                question: "Which communication model is widely used in interprofessional healthcare handoffs to ensure safe medication summaries?",
                options: ["GCS model", "SBAR (Situation, Background, Assessment, Recommendation)", "Naranjo Algorithm", "Beers checklist"],
                correctIndex: 2,
                explanation: "SBAR is a structured communication tool that ensures concise, accurate information transfers between clinical staff."
            },
            {
                question: "If a clinician discovers a medication error has occurred, what is their immediate ethical obligation?",
                options: [
                    "Conceal the error to prevent patient distress",
                    "Ensure patient safety, correct the error, and disclose the event to the patient and safety officer",
                    "Resign immediately",
                    "Verify the Naranjo score before notifying anyone"
                ],
                correctIndex: 1,
                explanation: "Ethical guidelines dictate immediate clinical mitigation, transparency with the patient, and reporting the incident for system review."
            },
            {
                question: "Which barrier frequently prevents clinicians from voluntarily reporting medication errors or near-misses?",
                options: ["Complete lack of reporting portals", "Fear of punitive actions, shame, or legal litigation", "Uncertainty of Naranjo causality", "Excessive patient counseling time"],
                correctIndex: 1,
                explanation: "Fear of blame, professional shame, and litigation are the primary causes of medication error concealment, highlights the need for Just Culture."
            }
        ]
    }
];

const DEFAULT_GLOBAL_USERS = [
    { name: "Dr. Emily Vance", email: "emily@hospital.org", role: "Clinical Pharmacist", level: 8, xp: 2400 },
    { name: "Prof. Alan Turing", email: "alan@decoders.edu", role: "Researcher", level: 7, xp: 1950 },
    { name: "Dr. David Chen", email: "david.chen@er.org", role: "Medical Doctor", level: 6, xp: 1550 },
    { name: "Sarah Jenkins", email: "sarah@pharmacy.net", role: "Clinical Pharmacist", level: 5, xp: 1200 },
    { name: "Alex Mercer", email: "alex@medschool.edu", role: "Medical Student", level: 4, xp: 950 },
    { name: "Zoe Washburne", email: "zoe@alliance.mil", role: "Registered Nurse", level: 3, xp: 700 },
    { name: "John Doe", email: "john@safety.com", role: "Patient/Researcher", level: 2, xp: 450 }
];

const BADGES_LIST = [
    { id: "first-quiz", name: "Novice Detective", icon: "🕵️", desc: "Pass your first module quiz." },
    { id: "streak-3", name: "Diligent Clinician", icon: "🔥", desc: "Maintain a 3-day active streak." },
    { id: "safety-reporter", name: "Safety Advocate", icon: "📝", desc: "Submit an adverse reaction practice form." },
    { id: "simulator-champ", name: "Life Saver", icon: "🩺", desc: "Complete all clinical cases successfully." },
    { id: "game-conqueror", name: "Battle Master", icon: "⚔️", desc: "Defeat Dr. Bot in the Quiz Battle game." },
    { id: "master-cert", name: "Certified Expert", icon: "🎓", desc: "Unlock the final course certificate." }
];

let YOUTUBE_RESOURCES_DATABASE = {
    1: [
        { title: "Introduction to Pharmacovigilance (WHO)", url: "https://www.youtube.com/watch?v=kYJqDCRzV7k", desc: "Learn the core guidelines and historical context of global drug safety directly from the World Health Organization." },
        { title: "Thalidomide: The Tragedy That Changed Drug Safety", url: "https://www.youtube.com/watch?v=4w2q55gT41M", desc: "A documentary review of the phocomelia crisis and the safety regulations that followed." }
    ],
    2: [
        { title: "Classification of Adverse Drug Reactions", url: "https://www.youtube.com/watch?v=ZJd7bYQ81dM", desc: "A clinical pharmacology walkthrough on Rawlins-Thompson classes Type A to Type F." }
    ],
    3: [
        { title: "Narrow Therapeutic Index Drugs & TDM", url: "https://www.youtube.com/watch?v=9g0H-S2s_2c", desc: "Understand blood concentration indices for Digoxin, Lithium, and Gentamicin." }
    ],
    4: [
        { title: "Geriatric Pharmacology: Beers Criteria Basics", url: "https://www.youtube.com/watch?v=F08VlP70i7c", desc: "Review fall prevention and renal adjustments for older populations." }
    ],
    5: [
        { title: "How to use the Naranjo Causality Algorithm", url: "https://www.youtube.com/watch?v=4d092mF58da", desc: "A clinical practice breakdown of scoring the temporal sequence, de-challenge, and re-challenge." }
    ],
    6: [
        { title: "FDA MedWatch Reporting Tutorial", url: "https://www.youtube.com/watch?v=vVj487D_a88", desc: "MedWatch Form 3500 walkthrough. Learn how to log clinical errors." }
    ],
    7: [
        { title: "REMS Programs & Risk Mitigation", url: "https://www.youtube.com/watch?v=84daN732mF8", desc: "Understand risk evaluation protocols and mandatory ANC registries." }
    ],
    8: [
        { title: "The Renal Triple Whammy Interaction", url: "https://www.youtube.com/watch?v=Xn72a983bF8", desc: "A cardiovascular pharmacology lecture reviewing NSAIDs, Diuretics, and ACE inhibitor interactions." }
    ],
    9: [
        { title: "Artificial Intelligence in Pharmacovigilance", url: "https://www.youtube.com/watch?v=kYJqDCRzV89", desc: "Exploring how NLP models scan electronic records for safety signals." }
    ],
    10: [
        { title: "Pharmacoeconomics: The Cost of Medical Errors", url: "https://www.youtube.com/watch?v=kYJqDCRzV90", desc: "Economic analyses on Direct ICU cost increases due to preventable ADRs." }
    ],
    11: [
        { title: "Immunogenicity of Biologicals & Vaccines", url: "https://www.youtube.com/watch?v=kYJqDCRzV91", desc: "Understand Cytokine Release Syndrome (CRS) and VAERS surveillance." }
    ],
    12: [
        { title: "Just Culture & Root Cause Analysis (RCA)", url: "https://www.youtube.com/watch?v=kYJqDCRzV92", desc: "A safety lecture detailing systemic investigations and professional safety ethics." }
    ]
};

const CHAPTERS_DATABASE = {
    1: [
        { name: "Welcome & History", start: 0 },
        { name: "Thalidomide phocomelia", start: 10 },
        { name: "Underreporting issues", start: 40 },
        { name: "MedWatch introduction", start: 55 }
    ],
    2: [
        { name: "Overview & classification", start: 0 },
        { name: "Type A predictability", start: 10 },
        { name: "Type B severity", start: 40 },
        { name: "Types C to F explained", start: 55 }
    ],
    3: [
        { name: "High-Alert overview", start: 0 },
        { name: "High-Risk categories", start: 15 },
        { name: "TDM monitoring", start: 30 },
        { name: "NTI safety benchmarks", start: 45 }
    ],
    4: [
        { name: "Introduction to Vulnerability", start: 0 },
        { name: "Geriatric falls risk", start: 15 },
        { name: "Grey Baby Syndrome", start: 30 },
        { name: "Pharmacogenomics HLA", start: 45 }
    ],
    5: [
        { name: "Causality overview", start: 0 },
        { name: "Naranjo Algorithm", start: 15 },
        { name: "Dechallenge & Rechallenge", start: 30 }
    ],
    6: [
        { name: "Spontaneous surveillance", start: 0 },
        { name: "FAERS & VigiBase registries", start: 15 },
        { name: "Four mandatory report items", start: 30 }
    ],
    7: [
        { name: "Risk management REMS", start: 0 },
        { name: "Alert fatigue dangers", start: 15 },
        { name: "Medication Reconciliation", start: 30 }
    ],
    8: [
        { name: "Interactions and polypharmacy", start: 0 },
        { name: "Triple Whammy AKI", start: 15 },
        { name: "Serotonin Syndrome diagnosis", start: 30 }
    ],
    9: [
        { name: "Medical informatics intro", start: 0 },
        { name: "EHR triggers", start: 15 },
        { name: "Machine learning signal checks", start: 30 }
    ],
    10: [
        { name: "Pharmacoeconomics overview", start: 0 },
        { name: "Direct hospital costs", start: 15 },
        { name: "Safety ROI models", start: 30 }
    ],
    11: [
        { name: "Immunogenicity of Biologicals", start: 0 },
        { name: "Cytokine Release Syndrome", start: 15 },
        { name: "Vaccine surveillance systems", start: 30 }
    ],
    12: [
        { name: "Professional clinical ethics", start: 0 },
        { name: "Just Culture model", start: 15 },
        { name: "Root Cause Analysis (RCA)", start: 30 }
    ]
};

// ==========================================
// 2. STATE MANAGEMENT & ROUTER
// ==========================================

let appState = {
    user: null,
    currentModuleId: 1,
    currentLessonIndex: 0,
    currentQuizQuestionIndex: 0,
    quizAnswers: [],
    currentSimCaseIndex: 0,
    currentLeaderboardTab: "weekly",
    gameData: {},
    tempDb: {
        users: [...DEFAULT_GLOBAL_USERS],
        reports: [
            { refId: "ADR-10023", patient: "M.K., 62", drug: "Lisinopril", reaction: "Dry cough, angioedema of lips", severity: "Moderate Severity" },
            { refId: "ADR-10024", patient: "L.B., 28", drug: "Amoxicillin", reaction: "Maculopapular rash, pruritus", severity: "Mild Toxicity" }
        ]
    }
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    loadSession();
    
    // SPA hash router
    window.addEventListener("hashchange", routePage);
    routePage();
    
    // Loading Screen fadeout
    setTimeout(() => {
        const loader = document.getElementById("loading-screen");
        if (loader) {
            loader.style.opacity = "0";
            setTimeout(() => {
                loader.style.display = "none";
            }, 500);
        }
    }, 1200);

    // Initial theme check
    if (localStorage.getItem("theme") === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        const themeBtn = document.getElementById("theme-toggle");
        if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    // Role-dependent College field visibility in registration form
    const regRoleSelect = document.getElementById("register-role");
    const collegeField = document.getElementById("college-field-group");
    if (regRoleSelect && collegeField) {
        const toggleCollegeField = () => {
            const isStudent = regRoleSelect.value.toLowerCase().includes("student");
            collegeField.style.display = isStudent ? "block" : "none";
        };
        toggleCollegeField();
        regRoleSelect.addEventListener("change", toggleCollegeField);
    }
});

function loadSession() {
    const savedUser = localStorage.getItem("adr_quest_user");
    const savedUsersList = localStorage.getItem("adr_quest_users_list");
    const savedReportsList = localStorage.getItem("adr_quest_reports_list");

    if (savedUsersList) {
        appState.tempDb.users = JSON.parse(savedUsersList);
    }
    if (savedReportsList) {
        appState.tempDb.reports = JSON.parse(savedReportsList);
    }

    if (savedUser) {
        appState.user = JSON.parse(savedUser);
        updateNavUserUi();
    } else {
        appState.user = null;
        updateNavUserUi();
    }
}

function saveSession() {
    if (appState.user) {
        localStorage.setItem("adr_quest_user", JSON.stringify(appState.user));
        
        // Update user record inside mock DB
        const userIndex = appState.tempDb.users.findIndex(u => u.email === appState.user.email);
        if (userIndex !== -1) {
            appState.tempDb.users[userIndex].xp = appState.user.xp;
            appState.tempDb.users[userIndex].level = appState.user.level;
            appState.tempDb.users[userIndex].name = appState.user.name;
        } else {
            appState.tempDb.users.push({
                name: appState.user.name,
                email: appState.user.email,
                role: appState.user.role,
                level: appState.user.level,
                xp: appState.user.xp
            });
        }
    }
    localStorage.setItem("adr_quest_users_list", JSON.stringify(appState.tempDb.users));
    localStorage.setItem("adr_quest_reports_list", JSON.stringify(appState.tempDb.reports));
}

function routePage() {
    const hash = window.location.hash.substring(1) || "landing";
    
    // Secure view interceptors
    const securePages = ["dashboard", "learning", "simulator", "games", "reporting", "progress", "certificate", "leaderboard", "profile", "admin"];
    if (securePages.includes(hash) && !appState.user) {
        showToast("Please sign in or register to access clinical safety portals", "warning");
        navigateTo("auth-login");
        return;
    }

    if (hash === "admin" && appState.user && appState.user.role !== "Admin") {
        showToast("Access Denied: Administrator clearance required.", "error");
        navigateTo("dashboard");
        return;
    }

    document.querySelectorAll(".view-section").forEach(sec => {
        sec.classList.remove("active-view");
    });
    
    const activeSec = document.getElementById(hash);
    if (activeSec) {
        activeSec.classList.add("active-view");
    }

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");
        const onclickAttr = link.getAttribute("onclick");
        if (onclickAttr && onclickAttr.includes(`'${hash}'`)) {
            link.classList.add("active");
        }
    });

    const navLinks = document.getElementById("nav-links");
    const burger = document.getElementById("hamburger");
    if (navLinks) navLinks.classList.remove("mobile-active");
    if (burger) burger.classList.remove("active");

    initViewHandler(hash);
    window.scrollTo(0, 0);
}

function initViewHandler(view) {
    switch(view) {
        case "dashboard":
            initDashboard();
            break;
        case "learning":
            initLearningView();
            break;
        case "simulator":
            initSimulatorView();
            break;
        case "reporting":
            document.getElementById("reporting-practice-form").reset();
            break;
        case "progress":
            initProgressView();
            break;
        case "certificate":
            initCertificateView();
            break;
        case "leaderboard":
            filterLeaderboard(appState.currentLeaderboardTab);
            break;
        case "profile":
            initProfileView();
            break;
        case "admin":
            initAdminDashboard();
            break;
    }
}

function navigateTo(viewName) {
    window.location.hash = viewName;
}

// ==========================================
// 3. UI THEME & NOTIFICATIONS
// ==========================================

function toggleTheme() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        themeBtn.innerHTML = newTheme === "dark" ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    }
    showToast(`Switched to ${newTheme} theme`, "info");
}

function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let icon = "fa-info-circle";
    if (type === "success") icon = "fa-circle-check";
    if (type === "error") icon = "fa-circle-xmark";
    if (type === "warning") icon = "fa-triangle-exclamation";

    toast.innerHTML = `
        <span style="display:flex; align-items:center; gap:0.5rem;">
            <i class="fa-solid ${icon}"></i>
            <span>${message}</span>
        </span>
        <i class="fa-solid fa-xmark" style="cursor:pointer;" onclick="this.parentElement.remove()"></i>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}

function toggleMobileMenu() {
    const navLinks = document.getElementById("nav-links");
    const burger = document.getElementById("hamburger");
    if (navLinks && burger) {
        navLinks.classList.toggle("mobile-active");
        burger.classList.toggle("active");
    }
}

function toggleFaq(elem) {
    const faqItem = elem.parentElement;
    faqItem.classList.toggle("active");
}

function scrollToAbout() {
    const element = document.getElementById("about-section");
    if (element) element.scrollIntoView({ behavior: 'smooth' });
}

function handleContactSubmit(event) {
    event.preventDefault();
    showToast("Contact query received! We will follow up shortly.", "success");
    event.target.reset();
}

// ==========================================
// 4. AUTHENTICATION CONTROLLER
// ==========================================

function updateNavUserUi() {
    const authBtn = document.getElementById("auth-nav-buttons");
    const userProfile = document.getElementById("user-nav-profile");
    const adminLink = document.getElementById("admin-nav-link");

    if (appState.user) {
        if (authBtn) authBtn.style.display = "none";
        if (userProfile) {
            userProfile.style.display = "flex";
            document.getElementById("nav-user-xp").innerText = `${appState.user.xp} XP`;
            document.getElementById("nav-user-avatar").innerText = appState.user.avatar || "👨‍⚕️";
            document.getElementById("nav-user-name").innerText = appState.user.name;
        }
        if (adminLink) {
            adminLink.style.display = appState.user.role === "Admin" ? "block" : "none";
        }
    } else {
        if (authBtn) authBtn.style.display = "flex";
        if (userProfile) userProfile.style.display = "none";
        if (adminLink) adminLink.style.display = "none";
    }
}

function handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const pass = document.getElementById("login-password").value;

    let isValid = true;
    
    if (!email || !email.includes("@")) {
        document.getElementById("login-email-err").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("login-email-err").style.display = "none";
    }

    if (pass.length < 6) {
        document.getElementById("login-password-err").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("login-password-err").style.display = "none";
    }

    if (!isValid) return;

    // Check custom database
    const matchedUser = appState.tempDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (matchedUser) {
        appState.user = {
            name: matchedUser.name,
            email: matchedUser.email,
            role: matchedUser.role,
            xp: matchedUser.xp || 0,
            level: matchedUser.level || 1,
            streak: 1,
            avatar: "👨‍⚕️",
            badges: matchedUser.role === "Admin" ? ["master-cert", "safety-reporter"] : ["first-quiz"],
            completedModules: matchedUser.role === "Admin" ? ["1","2","3","4","5","6","7","8","9","10","11","12"] : [],
            submittedReports: matchedUser.role === "Admin" ? 4 : 0,
            lastLoginDate: new Date().toDateString()
        };
    } else {
        appState.user = {
            name: email.split("@")[0],
            email: email,
            role: "Medical Student",
            xp: 0,
            level: 1,
            streak: 1,
            avatar: "👨‍⚕️",
            badges: [],
            completedModules: [],
            submittedReports: 0,
            lastLoginDate: new Date().toDateString()
        };
    }

    updateDailyStreak();
    saveSession();
    updateNavUserUi();
    showToast(`Welcome back, ${appState.user.name}!`, "success");
    navigateTo("dashboard");
}

function handleRegisterSubmit(event) {
    event.preventDefault();
    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const role = document.getElementById("register-role").value;
    const pass = document.getElementById("register-password").value;
    const confirm = document.getElementById("register-confirm").value;

    let isValid = true;

    if (!name) {
        document.getElementById("register-name-err").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("register-name-err").style.display = "none";
    }

    if (!email || !email.includes("@")) {
        document.getElementById("register-email-err").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("register-email-err").style.display = "none";
    }

    if (pass.length < 6) {
        document.getElementById("register-password-err").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("register-password-err").style.display = "none";
    }

    if (pass !== confirm) {
        document.getElementById("register-confirm-err").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("register-confirm-err").style.display = "none";
    }

    if (!isValid) return;

    const duplicate = appState.tempDb.users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (duplicate) {
        showToast("This email is already registered", "error");
        return;
    }

    appState.user = {
        name: name,
        email: email,
        role: role,
        xp: 0,
        level: 1,
        streak: 1,
        avatar: "👨‍⚕️",
        badges: [],
        completedModules: [],
        submittedReports: 0,
        lastLoginDate: new Date().toDateString()
    };

    saveSession();
    updateNavUserUi();
    showToast("Safety Training profile registered!", "success");
    navigateTo("dashboard");
}

function handleForgotSubmit(event) {
    event.preventDefault();
    const email = document.getElementById("forgot-email").value.trim();
    if (!email || !email.includes("@")) {
        document.getElementById("forgot-email-err").style.display = "block";
        return;
    }
    document.getElementById("forgot-email-err").style.display = "none";
    showToast(`Password reset link dispatched to ${email}`, "success");
    navigateTo("auth-login");
}

function logoutUser() {
    appState.user = null;
    localStorage.removeItem("adr_quest_user");
    updateNavUserUi();
    showToast("Session disconnected", "info");
    navigateTo("landing");
}

function updateDailyStreak() {
    if (!appState.user) return;
    const today = new Date().toDateString();
    
    if (appState.user.lastLoginDate) {
        const lastLogin = new Date(appState.user.lastLoginDate);
        const curr = new Date(today);
        const diffTime = Math.abs(curr - lastLogin);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            appState.user.streak += 1;
            if (appState.user.streak >= 3) {
                unlockBadge("streak-3");
            }
        } else if (diffDays > 1) {
            appState.user.streak = 1;
        }
    } else {
        appState.user.streak = 1;
    }
    appState.user.lastLoginDate = today;
}

// ==========================================
// 5. USER DASHBOARD INTERACTIVITY
// ==========================================

function initDashboard() {
    if (!appState.user) return;

    document.getElementById("dash-username").innerText = appState.user.name;
    document.getElementById("dash-level").innerText = `Level ${appState.user.level}`;
    document.getElementById("dash-xp").innerText = `${appState.user.xp} XP`;
    
    const currentLvlXp = appState.user.xp % 100;
    document.getElementById("dash-xp-progress").style.width = `${currentLvlXp}%`;
    document.getElementById("dash-xp-needed").innerText = `${100 - currentLvlXp} XP to Level ${appState.user.level + 1}`;

    document.getElementById("dash-streak").innerText = `${appState.user.streak} Day${appState.user.streak > 1 ? 's' : ''} Streak`;

    const score = Math.round((appState.user.completedModules.length / 12) * 100);
    document.getElementById("dash-knowledge-score").innerText = `${score}%`;

    let recommendedId = 1;
    if (appState.user.completedModules.length < 12) {
        recommendedId = Math.max(...appState.user.completedModules.map(Number), 0) + 1;
        if (recommendedId > 12) recommendedId = 12;
    } else {
        recommendedId = 12;
    }
    
    if (MODULES_DATA.length > 0) {
        const recModule = MODULES_DATA.find(m => m.id === recommendedId);
        if (recModule) {
            document.getElementById("dash-continue-module-title").innerText = `${recModule.id}. ${recModule.title}`;
        }
    }

    loadDailyChallenge();
    renderDashboardBadges();
    renderStudyPlanner();
    loadDailyLessons();
}

let CURRENT_DAILY_LESSONS = [];

async function loadDailyLessons() {
    try {
        CURRENT_DAILY_LESSONS = await apiFetch("/api/lessons");
        renderDailyLessonWidget();
    } catch (err) {
        console.error("Failed to load daily lessons:", err);
    }
}

function renderDailyLessonWidget() {
    const todayStr = getISTDateString();
    const todayLesson = CURRENT_DAILY_LESSONS.find(l => l.date === todayStr);
    
    const titleEl = document.getElementById("daily-lesson-title");
    const descEl = document.getElementById("daily-lesson-desc");
    const contentEl = document.getElementById("daily-lesson-content");
    const dateBadge = document.getElementById("daily-lesson-date-badge");
    const expandBtn = document.getElementById("daily-lesson-expand-btn");
    const completeBtn = document.getElementById("daily-lesson-complete-btn");
    const videoContainer = document.getElementById("daily-lesson-video-link-container");

    if (!todayLesson) {
        titleEl.innerText = "No Lesson Scheduled for Today";
        descEl.innerText = "Check back tomorrow for the next training checkpoint.";
        contentEl.style.display = "none";
        expandBtn.style.display = "none";
        completeBtn.style.display = "none";
        dateBadge.innerText = todayStr;
        return;
    }

    dateBadge.innerText = todayLesson.date;
    titleEl.innerText = todayLesson.title;
    descEl.innerText = todayLesson.description;
    
    contentEl.innerText = todayLesson.content;
    
    const completed = appState.user.completedDailyLessons && appState.user.completedDailyLessons.includes(todayLesson.id);
    if (completed) {
        completeBtn.className = "btn btn-success btn-sm";
        completeBtn.innerHTML = 'Completed <i class="fa-solid fa-circle-check"></i>';
        completeBtn.disabled = true;
    } else {
        completeBtn.className = "btn btn-primary btn-sm";
        completeBtn.innerHTML = 'Mark as Completed <i class="fa-solid fa-circle-check"></i>';
        completeBtn.disabled = false;
    }
    
    if (todayLesson.videoId) {
        videoContainer.innerHTML = `<a href="https://www.youtube.com/watch?v=${todayLesson.videoId}" target="_blank" class="btn btn-outline btn-sm" style="color:red; border-color:red; font-size:0.75rem;"><i class="fa-brands fa-youtube"></i> Watch Video</a>`;
    } else {
        videoContainer.innerHTML = "";
    }

    expandBtn.style.display = "inline-block";
    completeBtn.style.display = "inline-block";
}

function toggleDailyLessonExpand() {
    const content = document.getElementById("daily-lesson-content");
    const btn = document.getElementById("daily-lesson-expand-btn");
    if (content.style.display === "none") {
        content.style.display = "block";
        btn.innerHTML = 'Hide Lesson Content <i class="fa-solid fa-chevron-up"></i>';
    } else {
        content.style.display = "none";
        btn.innerHTML = 'Read Lesson Content <i class="fa-solid fa-chevron-down"></i>';
    }
}

async function markDailyLessonComplete() {
    const todayStr = getISTDateString();
    const todayLesson = CURRENT_DAILY_LESSONS.find(l => l.date === todayStr);
    if (!todayLesson) return;

    try {
        const res = await apiFetch("/api/progress/complete", {
            method: "POST",
            body: JSON.stringify({ isDailyLesson: true, lessonId: todayLesson.id })
        });
        if (res.success) {
            appState.user = res.user;
            updateNavUserUi();
            showToast("Daily lesson completed! +20 XP awarded.", "success");
            initDashboard();
        }
    } catch (err) {
        showToast("Error updating lesson completion", "error");
    }
}

let prevLessonsExpanded = false;
function togglePreviousLessonsList() {
    prevLessonsExpanded = !prevLessonsExpanded;
    const container = document.getElementById("previous-lessons-list");
    const arrow = document.getElementById("prev-lessons-arrow");
    
    if (prevLessonsExpanded) {
        container.style.display = "flex";
        arrow.className = "fa-solid fa-chevron-up";
        renderPreviousLessons();
    } else {
        container.style.display = "none";
        arrow.className = "fa-solid fa-chevron-down";
    }
}

function renderPreviousLessons() {
    const container = document.getElementById("previous-lessons-list");
    container.innerHTML = "";
    
    const todayStr = getISTDateString();
    const prevLessons = CURRENT_DAILY_LESSONS.filter(l => l.date < todayStr && !l.locked);
    
    if (prevLessons.length === 0) {
        container.innerHTML = `<p style="font-size:0.875rem; color:var(--text-muted); padding: 0.5rem 0;">No previous lessons released yet.</p>`;
        return;
    }
    
    prevLessons.forEach(less => {
        const completed = appState.user.completedDailyLessons && appState.user.completedDailyLessons.includes(less.id);
        const item = document.createElement("div");
        item.className = "glass-card";
        item.style.padding = "1rem";
        item.style.display = "flex";
        item.style.justifyContent = "space-between";
        item.style.alignItems = "center";
        item.style.gap = "1rem";
        
        item.innerHTML = `
            <div>
                <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted);">${less.date}</span>
                <h5 style="margin:0.25rem 0 0.5rem; font-size:1rem; color:var(--text-main);">${less.title}</h5>
                <p style="font-size:0.8rem; color:var(--text-muted); margin:0;">${less.description}</p>
            </div>
            <div style="display:flex; gap:0.5rem; align-items:center;">
                ${completed ? '<span style="font-size:0.75rem; font-weight:700; color:var(--success);"><i class="fa-solid fa-circle-check"></i> Completed</span>' : `<button class="btn btn-outline btn-xs" onclick="openPreviousLessonDialog('${less.id}')">Read Lesson</button>`}
            </div>
        `;
        container.appendChild(item);
    });
}

function openPreviousLessonDialog(id) {
    const lesson = CURRENT_DAILY_LESSONS.find(l => l.id === id);
    if (!lesson) return;

    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.style.display = "flex";

    modal.innerHTML = `
        <div class="glass-card modal-card" style="max-width: 600px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; border-bottom:1px solid var(--border-color); padding-bottom:0.75rem;">
                <h3>${lesson.title}</h3>
                <i class="fa-solid fa-xmark" style="cursor:pointer; font-size:1.25rem;" onclick="this.parentElement.parentElement.parentElement.remove()"></i>
            </div>
            <p style="font-size:0.8rem; font-weight:700; color:var(--primary); margin-bottom:1rem;">RELEASED ON ${lesson.date}</p>
            <p style="font-size:0.95rem; line-height:1.6; color:var(--text-main); margin-bottom:1.5rem; background:rgba(0,0,0,0.15); padding:1rem; border-radius:4px;">
                ${lesson.content}
            </p>
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
                <div>
                    ${lesson.videoId ? `<a href="https://www.youtube.com/watch?v=${lesson.videoId}" target="_blank" class="btn btn-outline btn-sm" style="color:red; border-color:red; font-size:0.75rem;"><i class="fa-brands fa-youtube"></i> Watch Video</a>` : ''}
                </div>
                <button class="btn btn-primary btn-sm" onclick="completePreviousLesson('${lesson.id}'); this.parentElement.parentElement.parentElement.remove();">Mark Completed <i class="fa-solid fa-circle-check"></i></button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function completePreviousLesson(id) {
    try {
        const res = await apiFetch("/api/progress/complete", {
            method: "POST",
            body: JSON.stringify({ isDailyLesson: true, lessonId: id })
        });
        if (res.success) {
            appState.user = res.user;
            updateNavUserUi();
            showToast("Lesson completed! +20 XP awarded.", "success");
            initDashboard();
        }
    } catch (err) {
        showToast("Error completing lesson", "error");
    }
}

function loadDailyChallenge() {
    const challengeIdx = new Date().getDate() % DAILY_CHALLENGES.length;
    const challenge = DAILY_CHALLENGES[challengeIdx];

    document.getElementById("daily-question").innerText = challenge.question;
    const optionsContainer = document.getElementById("daily-options");
    optionsContainer.innerHTML = "";

    document.getElementById("daily-feedback-panel").style.display = "none";

    challenge.options.forEach((opt, idx) => {
        const btn = document.createElement("div");
        btn.className = "quiz-option";
        btn.innerText = opt;
        btn.onclick = () => selectDailyOption(btn, idx, challenge);
        optionsContainer.appendChild(btn);
    });
}

function selectDailyOption(selectedBtn, index, challenge) {
    const parent = document.getElementById("daily-options");
    if (parent.querySelector(".correct") || parent.querySelector(".incorrect")) return;

    const options = parent.querySelectorAll(".quiz-option");
    const feedbackPanel = document.getElementById("daily-feedback-panel");
    const feedbackTitle = document.getElementById("daily-feedback-title");
    const feedbackDesc = document.getElementById("daily-feedback-desc");

    options.forEach((opt, idx) => {
        if (idx === challenge.correctIndex) {
            opt.classList.add("correct");
        } else if (idx === index) {
            opt.classList.add("incorrect");
        }
    });

    feedbackPanel.style.display = "block";
    if (index === challenge.correctIndex) {
        feedbackTitle.innerText = "Correct! +50 XP";
        feedbackTitle.style.color = "var(--success)";
        feedbackPanel.style.background = "rgba(34, 197, 94, 0.1)";
        feedbackPanel.style.border = "1px solid var(--success)";
        feedbackDesc.innerText = challenge.explanation;
        awardXp(50);
    } else {
        feedbackTitle.innerText = "Incorrect";
        feedbackTitle.style.color = "var(--danger)";
        feedbackPanel.style.background = "rgba(239, 68, 68, 0.1)";
        feedbackPanel.style.border = "1px solid var(--danger)";
        feedbackDesc.innerText = `The correct answer was: "${challenge.options[challenge.correctIndex]}". ${challenge.explanation}`;
    }
}

function renderDashboardBadges() {
    const container = document.getElementById("dashboard-badges");
    if (!container) return;
    container.innerHTML = "";

    BADGES_LIST.forEach(badge => {
        const isUnlocked = appState.user.badges.includes(badge.id);
        const item = document.createElement("div");
        item.className = `badge-item ${isUnlocked ? 'unlocked' : ''}`;
        item.title = `${badge.name}: ${badge.desc}`;
        item.innerHTML = `
            <div class="badge-img">${badge.icon}</div>
            <div class="badge-name">${badge.name}</div>
        `;
        container.appendChild(item);
    });
}

function awardXp(amount) {
    if (!appState.user) return;
    
    appState.user.xp += amount;
    const newLvl = Math.floor(appState.user.xp / 100) + 1;
    
    if (newLvl > appState.user.level) {
        appState.user.level = newLvl;
        showToast(`Congratulations! You leveled up to Level ${newLvl}!`, "success");
    }

    saveSession();
    updateNavUserUi();
}

// ==========================================
// 6. LEARNING SYSTEM ENGINE
// ==========================================

function initLearningView() {
    const listContainer = document.getElementById("modules-list");
    listContainer.innerHTML = "";

    MODULES_DATA.forEach(mod => {
        const isCompleted = appState.user.completedModules.includes(mod.id.toString());
        const isActive = appState.currentModuleId === mod.id;
        
        const li = document.createElement("li");
        li.className = `module-nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
        li.innerHTML = `
            <span>${mod.id}. ${mod.title}</span>
            ${isCompleted ? '<i class="fa-solid fa-circle-check" style="color:var(--success)"></i>' : '<i class="fa-solid fa-chevron-right"></i>'}
        `;
        li.onclick = () => selectModule(mod.id);
        listContainer.appendChild(li);
    });

    loadActiveLesson();
    resetVideoPlayback();
    loadVideoTranscript();
}

function selectModule(id) {
    appState.currentModuleId = id;
    appState.currentLessonIndex = 0;
    appState.currentQuizQuestionIndex = 0;
    appState.quizAnswers = [];
    
    // Default switch back to reading view on selecting module
    switchLearningSection("read");
    initLearningView();
}

function loadActiveLesson() {
    const currentModule = MODULES_DATA.find(m => m.id === appState.currentModuleId);
    if (!currentModule) return;

    document.getElementById("lesson-module-index").innerText = `MODULE ${currentModule.id} OF 12`;
    
    const progressPercent = Math.round((appState.currentLessonIndex / (currentModule.lessons.length + 1)) * 100);
    document.getElementById("lesson-progress-percent").innerText = `${progressPercent}% Completed`;
    document.getElementById("lesson-progress-bar").style.width = `${progressPercent}%`;

    const bodyContainer = document.getElementById("lesson-body");
    
    if (appState.currentLessonIndex < currentModule.lessons.length) {
        const lesson = currentModule.lessons[appState.currentLessonIndex];
        document.getElementById("lesson-title").innerText = lesson.title;
        
        bodyContainer.innerHTML = `
            <p style="margin-bottom:1.5rem; font-size:1.15rem; line-height:1.7;">${lesson.content}</p>
            <div style="margin-top:3rem; padding:1.5rem; border-radius:var(--radius-md); background:var(--background); border-left:4px solid var(--secondary);">
                <strong>Clinical Assessment Key:</strong> Standardize patient demographic logs and temporal event margins to calculate precise causation indexes.
            </div>
            <div style="margin-top:2.5rem; text-align:right;">
                <button class="btn btn-primary" onclick="advanceLesson()">Mark Lesson Read & Continue <i class="fa-solid fa-circle-arrow-right"></i></button>
            </div>
        `;
    } else {
        launchModuleQuiz(currentModule);
    }
}

function advanceLesson() {
    const currentModule = MODULES_DATA.find(m => m.id === appState.currentModuleId);
    if (!currentModule) return;

    appState.currentLessonIndex++;
    awardXp(20);
    loadActiveLesson();
}

function launchModuleQuiz(module) {
    document.getElementById("lesson-title").innerText = `${module.title} - Quiz`;
    document.getElementById("lesson-body").style.display = "none";
    document.getElementById("module-quiz-panel").style.display = "block";
    appState.currentQuizQuestionIndex = 0;
    appState.quizAnswers = [];
    
    renderQuizQuestion(module);
}

function renderQuizQuestion(module) {
    const quiz = module.quiz;
    const currentQuestion = quiz[appState.currentQuizQuestionIndex];

    document.getElementById("quiz-question-num").innerText = `Question ${appState.currentQuizQuestionIndex + 1} of ${quiz.length}`;
    document.getElementById("quiz-question-text").innerText = currentQuestion.question;

    const optionsBox = document.getElementById("quiz-options-container");
    optionsBox.innerHTML = "";

    currentQuestion.options.forEach((opt, idx) => {
        const div = document.createElement("div");
        div.className = "quiz-option";
        if (appState.quizAnswers[appState.currentQuizQuestionIndex] === idx) {
            div.classList.add("selected");
        }
        div.innerText = opt;
        div.onclick = () => {
            optionsBox.querySelectorAll(".quiz-option").forEach(el => el.classList.remove("selected"));
            div.classList.add("selected");
            appState.quizAnswers[appState.currentQuizQuestionIndex] = idx;
        };
        optionsBox.appendChild(div);
    });

    document.getElementById("quiz-prev-btn").disabled = appState.currentQuizQuestionIndex === 0;
    
    const nextBtn = document.getElementById("quiz-next-btn");
    if (appState.currentQuizQuestionIndex === quiz.length - 1) {
        nextBtn.innerText = "Submit Quiz";
        nextBtn.classList.remove("btn-primary");
        nextBtn.classList.add("btn-secondary");
    } else {
        nextBtn.innerText = "Next Question";
        nextBtn.classList.remove("btn-secondary");
        nextBtn.classList.add("btn-primary");
    }
}

function prevQuizQuestion() {
    if (appState.currentQuizQuestionIndex > 0) {
        appState.currentQuizQuestionIndex--;
        const currentModule = MODULES_DATA.find(m => m.id === appState.currentModuleId);
        renderQuizQuestion(currentModule);
    }
}

function nextQuizQuestion() {
    const currentModule = MODULES_DATA.find(m => m.id === appState.currentModuleId);
    if (!currentModule) return;

    const selectedIndex = appState.quizAnswers[appState.currentQuizQuestionIndex];
    if (selectedIndex === undefined) {
        showToast("Please choose an answer option to proceed.", "warning");
        return;
    }

    if (appState.currentQuizQuestionIndex < currentModule.quiz.length - 1) {
        appState.currentQuizQuestionIndex++;
        renderQuizQuestion(currentModule);
    } else {
        evaluateQuizResults(currentModule);
    }
}

function evaluateQuizResults(module) {
    let score = 0;
    module.quiz.forEach((q, idx) => {
        if (appState.quizAnswers[idx] === q.correctIndex) {
            score++;
        }
    });

    const percent = Math.round((score / module.quiz.length) * 100);
    const passed = percent >= 80;

    const dialog = document.createElement("div");
    dialog.className = "modal-overlay";
    dialog.style.display = "flex";

    dialog.innerHTML = `
        <div class="glass-card modal-card" style="text-align:center;">
            <h3 style="color:${passed ? 'var(--success)' : 'var(--danger)'}; margin-bottom:1rem;">
                ${passed ? '🎉 Module Mastery Verified!' : '❌ Study Required'}
            </h3>
            <div style="font-size:3rem; margin-bottom:1rem;">
                ${passed ? '🏆' : '📚'}
            </div>
            <p style="font-size:1.2rem; font-weight:600; margin-bottom:1rem;">You scored: ${percent}% (${score}/${module.quiz.length})</p>
            <p style="color:var(--text-muted); margin-bottom:2rem;">
                ${passed ? 'Outstanding work! You have successfully registered course credentials.' : 'Safety guidelines dictate a score of at least 80% to authorize completions.'}
            </p>
            <div>
                <button class="btn btn-outline" onclick="this.parentElement.parentElement.parentElement.remove(); navigateTo('dashboard');">Dashboard</button>
                <button class="btn btn-primary" onclick="this.parentElement.parentElement.parentElement.remove(); resetQuizTrial()">Try Again</button>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);

    if (passed) {
        apiFetch("/api/progress/complete", {
            method: "POST",
            body: JSON.stringify({ moduleId: module.id })
        }).then(res => {
            if (res.success) {
                appState.user = res.user;
                updateNavUserUi();
                showToast("Course credentials published!", "success");
            }
        }).catch(err => {
            console.error("Failed to commit progress:", err);
            showToast("Failed to save progress to server", "error");
        });
    }
}

function resetQuizTrial() {
    appState.currentLessonIndex = 0;
    appState.currentQuizQuestionIndex = 0;
    appState.quizAnswers = [];
    document.getElementById("module-quiz-panel").style.display = "none";
    document.getElementById("lesson-body").style.display = "block";
    initLearningView();
}

function unlockBadge(badgeId) {
    if (!appState.user) return;
    if (appState.user.badges.includes(badgeId)) return;

    appState.user.badges.push(badgeId);
    const badge = BADGES_LIST.find(b => b.id === badgeId);
    if (badge) {
        showToast(`Badge Unlocked: ${badge.name} ${badge.icon}!`, "success");
    }
    saveSession();
}

// ==========================================
// 7. CLINICAL CASE SIMULATOR
// ==========================================

function initSimulatorView() {
    const caseData = CLINICAL_CASES[appState.currentSimCaseIndex];
    if (!caseData) {
        document.getElementById("sim-case-category").innerText = "SIMULATOR MASTERED";
        document.getElementById("sim-case-title").innerText = "All Simulations Cleared!";
        document.getElementById("sim-case-description").innerText = "You have completed all active medical safety training modules.";
        document.getElementById("sim-options").innerHTML = "";
        document.getElementById("sim-feedback").style.display = "none";
        
        document.getElementById("sim-vital-hr").innerText = "Normal";
        document.getElementById("sim-vital-bp").innerText = "Normal";
        document.getElementById("sim-vital-temp").innerText = "Normal";
        document.getElementById("sim-vital-o2").innerText = "Normal";

        unlockBadge("simulator-champ");
        return;
    }

    document.getElementById("sim-case-category").innerText = caseData.category;
    document.getElementById("sim-case-title").innerText = caseData.title;
    document.getElementById("sim-case-description").innerText = caseData.description;

    document.getElementById("sim-vital-hr").innerText = `${caseData.vitalsStart.hr} bpm`;
    document.getElementById("sim-vital-bp").innerText = caseData.vitalsStart.bp;
    document.getElementById("sim-vital-temp").innerText = `${caseData.vitalsStart.temp} °C`;
    document.getElementById("sim-vital-o2").innerText = `${caseData.vitalsStart.o2}%`;

    setVitalsStyling(caseData.vitalsStart);

    const container = document.getElementById("sim-options");
    container.innerHTML = "";
    document.getElementById("sim-feedback").style.display = "none";

    caseData.options.forEach((opt, idx) => {
        const item = document.createElement("div");
        item.className = "quiz-option";
        item.innerText = opt.text;
        item.onclick = () => selectSimulatorOption(item, opt, caseData);
        container.appendChild(item);
    });
}

function setVitalsStyling(vitals) {
    const hr = document.getElementById("sim-vital-hr");
    const bp = document.getElementById("sim-vital-bp");
    const temp = document.getElementById("sim-vital-temp");
    const o2 = document.getElementById("sim-vital-o2");

    if (vitals.hr < 50 || vitals.hr > 100) hr.style.color = "var(--danger)";
    else hr.style.color = "var(--secondary)";

    if (vitals.o2 < 92) o2.style.color = "var(--danger)";
    else o2.style.color = "var(--secondary)";
}

function selectSimulatorOption(btn, option, caseData) {
    const parent = document.getElementById("sim-options");
    if (parent.querySelector(".correct") || parent.querySelector(".incorrect")) return;

    btn.classList.add(option.correct ? "correct" : "incorrect");
    
    if (!option.correct) {
        const optionsList = parent.querySelectorAll(".quiz-option");
        caseData.options.forEach((opt, i) => {
            if (opt.correct) {
                optionsList[i].classList.add("correct");
            }
        });
    }

    const feedback = document.getElementById("sim-feedback");
    const fTitle = document.getElementById("sim-feedback-title");
    const fDesc = document.getElementById("sim-feedback-desc");

    feedback.style.display = "block";
    if (option.correct) {
        fTitle.innerText = `Decision Approved! +${caseData.xpReward} XP`;
        fTitle.style.color = "var(--success)";
        feedback.style.background = "rgba(34, 197, 94, 0.1)";
        fDesc.innerText = option.explanation;
        awardXp(caseData.xpReward);
    } else {
        fTitle.innerText = "Alternative Action Required";
        fTitle.style.color = "var(--danger)";
        feedback.style.background = "rgba(239, 68, 68, 0.1)";
        fDesc.innerText = option.explanation;
    }
}

function loadNextSimulatorCase() {
    appState.currentSimCaseIndex++;
    initSimulatorView();
}

// ==========================================
// 8. SERIOUS MINI-GAMES HUB
// ==========================================

function openGame(gameType) {
    const overlay = document.getElementById("game-arena-overlay");
    const content = document.getElementById("game-arena-content");
    overlay.style.display = "flex";
    
    appState.gameData = { type: gameType, score: 0, current: 0 };

    if (gameType === "quiz-battle") {
        startQuizBattleGame(content);
    } else if (gameType === "match-drug") {
        startMatchDrugGame(content);
    } else if (gameType === "true-false") {
        startTrueFalseGame(content);
    } else if (gameType === "time-attack") {
        startTimeAttackGame(content);
    } else if (gameType === "adr-detective") {
        startDetectiveGame(content);
    }
}

function closeGameArena() {
    if (appState.gameData.timerInterval) {
        clearInterval(appState.gameData.timerInterval);
    }
    document.getElementById("game-arena-overlay").style.display = "none";
}

// GAME 1: Quiz Battle Game vs Dr. Bot
function startQuizBattleGame(content) {
    appState.gameData.playerHp = 100;
    appState.gameData.botHp = 100;
    appState.gameData.questions = [
        { q: "Which class of drugs is commonly associated with hyperkalemia?", options: ["Loop Diuretics", "ACE Inhibitors", "Beta-2 Agonists", "Thiazide Diuretics"], correct: 1 },
        { q: "Acetaminophen overdose leads directly to necrosis of which organ?", options: ["Heart", "Lungs", "Kidneys", "Liver"], correct: 3 },
        { q: "Gingival hyperplasia (gum swelling) is a classic ADR of which anticonvulsant?", options: ["Phenytoin", "Valproic Acid", "Gabapentin", "Carbamazepine"], correct: 0 },
        { q: "Which HLA genotype predisposes patients to severe cutaneous reactions from Abacavir?", options: ["HLA-B*1502", "HLA-B*5701", "HLA-A*3101", "HLA-DRB1*04"], correct: 1 }
    ];

    drawQuizBattleFrame(content);
}

function drawQuizBattleFrame(content) {
    const currentQ = appState.gameData.questions[appState.gameData.current];
    
    if (!currentQ || appState.gameData.playerHp <= 0 || appState.gameData.botHp <= 0) {
        endGameSession(content, "Quiz Battle");
        return;
    }

    content.innerHTML = `
        <h3 style="text-align:center; margin-bottom:1.5rem;"><i class="fa-solid fa-swords"></i> Quiz Battle vs Dr. Bot</h3>
        
        <div style="display:flex; justify-content:space-around; align-items:center; margin-bottom:2rem;">
            <div style="text-align:center;">
                <div style="font-size:2.5rem;">👨‍⚕️</div>
                <div style="font-weight:600; margin-bottom:0.25rem;">Clinician (You)</div>
                <div class="battle-health-bar-bg">
                    <div id="player-hp-bar" class="battle-health-bar-fg ${appState.gameData.playerHp <= 35 ? 'low-hp' : ''}" style="width: ${appState.gameData.playerHp}%;"></div>
                </div>
                <span id="player-hp-text">HP: ${appState.gameData.playerHp}/100</span>
            </div>
            
            <div style="font-size: 2rem; font-weight:800; color:var(--accent);">VS</div>
            
            <div style="text-align:center;">
                <div style="font-size:2.5rem;">🤖</div>
                <div style="font-weight:600; margin-bottom:0.25rem;">Dr. Bot</div>
                <div class="battle-health-bar-bg">
                    <div id="bot-hp-bar" class="battle-health-bar-fg ${appState.gameData.botHp <= 35 ? 'low-hp' : ''}" style="width: ${appState.gameData.botHp}%; background:linear-gradient(90deg, #ef4444, #f43f5e);"></div>
                </div>
                <span id="bot-hp-text">HP: ${appState.gameData.botHp}/100</span>
            </div>
        </div>

        <div style="background:#334155; padding:2rem; border-radius:var(--radius-md); margin-bottom:2rem; min-height:90px; display:flex; align-items:center; justify-content:center;">
            <p style="font-size:1.15rem; font-weight:600; text-align:center;" id="battle-question-text">${currentQ.q}</p>
        </div>

        <div class="quiz-options" id="battle-options-box">
            ${currentQ.options.map((opt, idx) => `
                <div class="match-tile" onclick="chooseBattleOption(this, ${idx})">${opt}</div>
            `).join('')}
        </div>
    `;
}

function chooseBattleOption(btn, idx) {
    const currentQ = appState.gameData.questions[appState.gameData.current];
    const arenaCard = document.querySelector('.game-arena-card');
    const parent = document.getElementById("battle-options-box");
    if (parent.querySelector(".correct") || parent.querySelector(".incorrect")) return;

    if (idx === currentQ.correct) {
        btn.style.borderColor = "var(--success)";
        btn.style.background = "rgba(34,197,94,0.1)";
        appState.gameData.botHp = Math.max(0, appState.gameData.botHp - 25);
        showToast("Correct Strike! Dr. Bot loses HP", "success");
    } else {
        btn.style.borderColor = "var(--danger)";
        btn.style.background = "rgba(239,68,68,0.1)";
        
        if (arenaCard) {
            arenaCard.classList.add("shake-effect");
            setTimeout(() => arenaCard.classList.remove("shake-effect"), 500);
        }
        
        appState.gameData.playerHp = Math.max(0, appState.gameData.playerHp - 34);
        showToast("Wrong defense! Dr. Bot retaliates", "error");
    }

    document.getElementById("player-hp-bar").style.width = `${appState.gameData.playerHp}%`;
    document.getElementById("player-hp-text").innerText = `HP: ${appState.gameData.playerHp}/100`;
    document.getElementById("bot-hp-bar").style.width = `${appState.gameData.botHp}%`;
    document.getElementById("bot-hp-text").innerText = `HP: ${appState.gameData.botHp}/100`;

    appState.gameData.current++;
    
    setTimeout(() => {
        drawQuizBattleFrame(document.getElementById("game-arena-content"));
    }, 1200);
}

// GAME 2: Match the Drug Grid Board
function startMatchDrugGame(content) {
    const shuffled = [...DRUG_ADR_PAIRS].sort(() => 0.5 - Math.random()).slice(0, 4);
    appState.gameData.selectedTiles = [];
    appState.gameData.matchedCount = 0;

    let pool = [];
    shuffled.forEach(p => {
        pool.push({ text: p.drug, type: "drug", key: p.drug });
        pool.push({ text: p.adr, type: "adr", key: p.drug });
    });
    pool.sort(() => 0.5 - Math.random());

    content.innerHTML = `
        <h3 style="text-align:center; margin-bottom:1rem;"><i class="fa-solid fa-grid-2"></i> Match the Drug Grid</h3>
        <p style="text-align:center; color:#94a3b8; margin-bottom:2rem;">Click a suspected drug and then click its classic adverse event to match them.</p>

        <div class="match-grid-container" id="drug-match-grid">
            ${pool.map((t, idx) => `
                <div class="match-tile" data-idx="${idx}" data-type="${t.type}" data-key="${t.key}" onclick="clickMatchTile(this)">${t.text}</div>
            `).join('')}
        </div>
    `;
}

function clickMatchTile(elem) {
    if (elem.classList.contains("matched") || elem.classList.contains("selected")) return;

    elem.classList.add("selected");
    appState.gameData.selectedTiles.push(elem);

    if (appState.gameData.selectedTiles.length === 2) {
        const tile1 = appState.gameData.selectedTiles[0];
        const tile2 = appState.gameData.selectedTiles[1];

        const type1 = tile1.getAttribute("data-type");
        const type2 = tile2.getAttribute("data-type");
        const key1 = tile1.getAttribute("data-key");
        const key2 = tile2.getAttribute("data-key");

        if (type1 !== type2 && key1 === key2) {
            tile1.classList.remove("selected");
            tile2.classList.remove("selected");
            tile1.classList.add("matched");
            tile2.classList.add("matched");
            
            showToast("Hallmark toxicity match identified!", "success");
            appState.gameData.matchedCount++;
            
            if (appState.gameData.matchedCount === 4) {
                appState.gameData.score = 100;
                setTimeout(() => {
                    endGameSession(document.getElementById("game-arena-content"), "Match the Drug");
                }, 1000);
            }
        } else {
            showToast("Therapeutic mismatch. Try again.", "error");
            setTimeout(() => {
                tile1.classList.remove("selected");
                tile2.classList.remove("selected");
            }, 800);
        }
        appState.gameData.selectedTiles = [];
    }
}

// GAME 3: True or False Game
function startTrueFalseGame(content) {
    appState.gameData.questions = [
        { statement: "Underreporting is a major challenge; less than 10% of serious ADRs are formally reported.", answer: true, explanation: "Correct. Studies verify only about 5-10% of severe adverse reactions reach regulatory spontaneous databases." },
        { statement: "Type A reactions are unpredictable, dose-independent, and carry high mortality.", answer: false, explanation: "Incorrect. Type A (Augmented) reactions are predictable, dose-dependent extension responses." },
        { statement: "The Beers Criteria lists medications appropriate for pediatric populations.", answer: false, explanation: "Incorrect. Beers Criteria specifically guides clinicians on inappropriate medications for older/geriatric populations." }
    ];

    drawTrueFalseFrame(content);
}

function drawTrueFalseFrame(content) {
    const currentQ = appState.gameData.questions[appState.gameData.current];
    if (!currentQ) {
        endGameSession(content, "True or False");
        return;
    }

    content.innerHTML = `
        <h3 style="text-align:center; margin-bottom:1rem;"><i class="fa-solid fa-scale-balanced"></i> True or False</h3>
        <p style="text-align:center; color:#94a3b8; margin-bottom:2rem;">Verify if the clinical safety statement is correct.</p>

        <div style="background:#334155; padding:3rem; border-radius:var(--radius-md); margin-bottom:2rem; text-align:center; min-height:120px; display:flex; align-items:center; justify-content:center;">
            <p style="font-size:1.25rem; font-weight:500; line-height:1.6;">"${currentQ.statement}"</p>
        </div>

        <div style="display:flex; gap:1.5rem;" id="tf-action-panel">
            <button class="btn btn-secondary" style="flex:1; padding:1.25rem; font-size:1.1rem;" onclick="answerTrueFalse(true)">TRUE</button>
            <button class="btn btn-primary" style="flex:1; padding:1.25rem; font-size:1.1rem;" onclick="answerTrueFalse(false)">FALSE</button>
        </div>
    `;
}

function answerTrueFalse(ans) {
    const currentQ = appState.gameData.questions[appState.gameData.current];
    const content = document.getElementById("game-arena-content");
    const panel = document.getElementById("tf-action-panel");
    if (panel) panel.style.pointerEvents = "none";

    if (ans === currentQ.answer) {
        appState.gameData.score += 33;
        showToast("Correct verification!", "success");
    } else {
        showToast("Incorrect statement etiology.", "error");
    }

    const div = document.createElement("div");
    div.style.marginTop = "2rem";
    div.style.padding = "1.25rem";
    div.style.borderRadius = "var(--radius-md)";
    div.style.background = ans === currentQ.answer ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)";
    div.style.border = `1px solid ${ans === currentQ.answer ? 'var(--success)' : 'var(--danger)'}`;
    div.innerHTML = `<strong>RATIONALE:</strong> ${currentQ.explanation}`;
    content.appendChild(div);

    appState.gameData.current++;
    setTimeout(() => {
        drawTrueFalseFrame(content);
    }, 3000);
}

// GAME 4: Time Attack
function startTimeAttackGame(content) {
    appState.gameData.timeLeft = 20;
    appState.gameData.score = 0;
    appState.gameData.questions = [
        { q: "Causality algorithm with 10 scoring points?", options: ["Wells", "GCS", "Naranjo", "Beers"], correct: 2 },
        { q: "Severe Penicillin toxicity response?", options: ["Gout", "Anaphylaxis", "Scurvy", "Psoriasis"], correct: 1 },
        { q: "Clozapine REMS tracks what values?", options: ["Blood Pressure", "Absolute Neutrophils", "Serum GFR", "Potassium"], correct: 1 },
        { q: "Amiodarone blue skin deposition is called?", options: ["Cyanosis", "Ceruloderma", "Jaundice", "Erythema"], correct: 1 }
    ];

    appState.gameData.timerInterval = setInterval(() => {
        appState.gameData.timeLeft--;
        const timerEl = document.getElementById("time-attack-timer");
        if (timerEl) {
            timerEl.innerText = `Time Remaining: ${appState.gameData.timeLeft}s`;
        }
        if (appState.gameData.timeLeft <= 0) {
            clearInterval(appState.gameData.timerInterval);
            endGameSession(document.getElementById("game-arena-content"), "Time Attack");
        }
    }, 1000);

    drawTimeAttackFrame(content);
}

function drawTimeAttackFrame(content) {
    const currentQ = appState.gameData.questions[appState.gameData.current];
    if (!currentQ || appState.gameData.timeLeft <= 0) {
        clearInterval(appState.gameData.timerInterval);
        endGameSession(content, "Time Attack");
        return;
    }

    content.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
            <h3>⏱️ Time Attack Blitz</h3>
            <span id="time-attack-timer" style="font-weight:700; color:var(--accent); font-size:1.2rem;">Time Remaining: ${appState.gameData.timeLeft}s</span>
        </div>

        <div style="background:#334155; padding:2rem; border-radius:var(--radius-md); margin-bottom:2rem; text-align:center; min-height:80px; display:flex; align-items:center; justify-content:center;">
            <p style="font-size:1.2rem; font-weight:600;">${currentQ.q}</p>
        </div>

        <div class="quiz-options" id="blitz-options-box">
            ${currentQ.options.map((opt, idx) => `
                <div class="match-tile" onclick="submitTimeAttackAnswer(this, ${idx})">${opt}</div>
            `).join('')}
        </div>
    `;
}

function submitTimeAttackAnswer(btn, idx) {
    const currentQ = appState.gameData.questions[appState.gameData.current];
    const parent = document.getElementById("blitz-options-box");
    if (parent.style.pointerEvents === "none") return;
    parent.style.pointerEvents = "none";

    if (idx === currentQ.correct) {
        btn.style.borderColor = "var(--success)";
        btn.style.background = "rgba(34,197,94,0.1)";
        appState.gameData.score += 25;
        showToast("Correct! Speed bonus", "success");
    } else {
        btn.style.borderColor = "var(--danger)";
        btn.style.background = "rgba(239,68,68,0.1)";
        showToast("Incorrect!", "error");
    }

    appState.gameData.current++;
    setTimeout(() => {
        drawTimeAttackFrame(document.getElementById("game-arena-content"));
    }, 600);
}

// GAME 5: ADR Detective Game
function startDetectiveGame(content) {
    appState.gameData.suspects = [
        { 
            file: "Patient presents with acute renal failure after starting a combination of Lisinopril, Hydrochlorothiazide, and Ibuprofen. What is this clinical triad known as?", 
            choices: ["DRESS Syndrome", "Triple Whammy", "Prescribing Cascade", "Hy's Law"],
            answer: "Triple Whammy", 
            rationale: "Combining an ACE inhibitor (Lisinopril), a diuretic (HCTZ), and an NSAID (Ibuprofen) synergistically shuts down glomerular filtration, causing acute kidney injury." 
        },
        { 
            file: "A patient displays muscle rigidity, hyperthermia, and inducible clonus after being treated with Sertraline and Linezolid. What toxic syndrome is suspected?", 
            choices: ["Neuroleptic Malignant Syndrome", "Serotonin Syndrome", "Anaphylactic Shock", "Ototoxicity"],
            answer: "Serotonin Syndrome", 
            rationale: "Linezolid acts as a monoamine oxidase inhibitor (MAOI). When combined with an SSRI like Sertraline, it causes excessive synaptic serotonin buildup." 
        }
    ];

    drawDetectiveFrame(content);
}

function drawDetectiveFrame(content) {
    const currentQ = appState.gameData.suspects[appState.gameData.current];
    if (!currentQ) {
        endGameSession(content, "ADR Detective");
        return;
    }

    content.innerHTML = `
        <h3 style="text-align:center; margin-bottom:1rem;"><i class="fa-solid fa-magnifying-glass-chart"></i> ADR Detective Clues</h3>
        <p style="text-align:center; color:#94a3b8; margin-bottom:2rem;">Analyze the clinical file record to identify the diagnostic syndrome.</p>

        <div style="background:#1e293b; border-left:4px solid var(--accent); padding:2rem; border-radius:var(--radius-md); margin-bottom:2rem; min-height:90px;">
            <strong>CASE RECORD FILE #${appState.gameData.current + 1}:</strong>
            <p style="margin-top:0.5rem; font-style:italic; line-height:1.6;">"${currentQ.file}"</p>
        </div>

        <div style="margin-bottom:1.5rem;">
            <label style="font-weight:600; display:block; margin-bottom:1rem;">Who is the culprit clinical syndrome?</label>
            <div class="quiz-options" id="detective-options-box">
                ${currentQ.choices.map(c => `
                    <div class="match-tile" onclick="answerDetective(this, '${c}')">${c}</div>
                `).join('')}
            </div>
        </div>
    `;
}

function answerDetective(btn, val) {
    const currentQ = appState.gameData.suspects[appState.gameData.current];
    const content = document.getElementById("game-arena-content");
    const parent = document.getElementById("detective-options-box");
    if (parent.style.pointerEvents === "none") return;
    parent.style.pointerEvents = "none";

    if (val === currentQ.answer) {
        btn.style.borderColor = "var(--success)";
        btn.style.background = "rgba(34,197,94,0.1)";
        appState.gameData.score += 50;
        showToast("Correct assessment, Detective!", "success");
    } else {
        btn.style.borderColor = "var(--danger)";
        btn.style.background = "rgba(239,68,68,0.1)";
        showToast("Incorrect assessment.", "error");
    }

    const div = document.createElement("div");
    div.style.marginTop = "2rem";
    div.style.padding = "1.25rem";
    div.style.borderRadius = "var(--radius-md)";
    div.style.background = val === currentQ.answer ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)";
    div.style.border = `1px solid ${val === currentQ.answer ? 'var(--success)' : 'var(--danger)'}`;
    div.innerHTML = `<strong>EXPLANATION:</strong> ${currentQ.rationale}`;
    content.appendChild(div);

    appState.gameData.current++;
    setTimeout(() => {
        drawDetectiveFrame(document.getElementById("game-arena-content"));
    }, 4000);
}

function endGameSession(content, title) {
    const totalAward = Math.min(appState.gameData.score || 50, 100);
    
    if (title === "Quiz Battle" && appState.gameData.playerHp > 0) {
        unlockBadge("game-conqueror");
    }

    content.innerHTML = `
        <div style="text-align:center; padding:3rem;">
            <h2 style="color:var(--secondary); margin-bottom:1rem;">🎉 Game Cleared!</h2>
            <div style="font-size:4rem; margin-bottom:1.5rem;">🎮</div>
            <h3>${title} Completed</h3>
            <p style="font-size:1.25rem; font-weight:600; margin:1rem 0;">You earned: +${totalAward} XP</p>
            <button class="btn btn-secondary" onclick="closeGameArena()">Close safety Arena</button>
        </div>
    `;
    awardXp(totalAward);
}

// ==========================================
// 9. ADR REPORTING PRACTICE FORM
// ==========================================

async function handleReportFormSubmit(event) {
    event.preventDefault();
    
    const initials = document.getElementById("rep-pat-id").value.trim();
    const age = document.getElementById("rep-pat-age").value.trim();
    const gender = document.getElementById("rep-pat-gender").value;
    const drugName = document.getElementById("rep-drug-name").value.trim();
    const dose = document.getElementById("rep-drug-dose").value.trim();
    const reaction = document.getElementById("rep-reaction").value.trim();
    const onsetDate = document.getElementById("rep-onset-date").value;
    const seriousness = document.getElementById("rep-seriousness").value;

    let isValid = true;

    if (!initials) {
        document.getElementById("rep-pat-id-err").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("rep-pat-id-err").style.display = "none";
    }

    if (!age || isNaN(age)) {
        document.getElementById("rep-pat-age-err").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("rep-pat-age-err").style.display = "none";
    }

    if (!drugName) {
        document.getElementById("rep-drug-name-err").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("rep-drug-name-err").style.display = "none";
    }

    if (!dose) {
        document.getElementById("rep-drug-dose-err").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("rep-drug-dose-err").style.display = "none";
    }

    if (reaction.length < 10) {
        document.getElementById("rep-reaction-err").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("rep-reaction-err").style.display = "none";
    }

    if (!onsetDate) {
        document.getElementById("rep-onset-date-err").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("rep-onset-date-err").style.display = "none";
    }

    if (!isValid) {
        showToast("Please fix the validation parameters errors.", "error");
        return;
    }

    try {
        const res = await apiFetch("/api/reports/submit", {
            method: "POST",
            body: JSON.stringify({
                initials,
                age: Number(age),
                gender,
                drugName,
                dose,
                reaction,
                onsetDate,
                seriousness
            })
        });

        if (res.success) {
            appState.user = res.user;
            updateNavUserUi();

            document.getElementById("summary-ref-id").innerText = res.report.refId;
            document.getElementById("summary-pat-id").innerText = `${initials}, Age ${age}`;
            document.getElementById("summary-drug").innerText = drugName;
            document.getElementById("summary-severity").innerText = seriousness;

            document.getElementById("report-summary-modal").style.display = "flex";
            showToast("Report submitted successfully! +100 XP", "success");
        }
    } catch (err) {
        showToast("Failed to submit safety report: " + err.message, "error");
    }
}

function closeSummaryModal() {
    document.getElementById("report-summary-modal").style.display = "none";
    document.getElementById("reporting-practice-form").reset();
    navigateTo("dashboard");
}

// ==========================================
// 10. PROGRESS & ANALYTICS CHARTS
// ==========================================

function initProgressView() {
    const count = appState.user.completedModules.length;
    // Tracks out of 12 modules completed
    document.getElementById("cert-status-msg").innerText = `Progress: ${count} / 12 Modules Done`;
    
    const viewBtn = document.getElementById("cert-view-btn");
    if (count === 12) {
        viewBtn.removeAttribute("disabled");
        viewBtn.classList.remove("btn-outline");
        viewBtn.classList.add("btn-secondary");
        document.getElementById("certificate-unlock-card").style.borderColor = "var(--success)";
    } else {
        viewBtn.setAttribute("disabled", "true");
        viewBtn.classList.add("btn-outline");
        viewBtn.classList.remove("btn-secondary");
    }

    setTimeout(() => {
        renderMasteryChart();
        renderAccuracyChart();
        renderXpHistoryChart();
    }, 100);
}

function renderMasteryChart() {
    const canvas = document.getElementById("chart-module-completion");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = 300 * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const completed = appState.user.completedModules.length;
    const percentage = completed / 12;

    const x = rect.width / 2;
    const y = 150;
    const radius = 80;

    ctx.clearRect(0, 0, rect.width, 300);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(226, 232, 240, 0.8)";
    ctx.lineWidth = 15;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, radius, -0.5 * Math.PI, (2 * percentage - 0.5) * Math.PI);
    ctx.strokeStyle = "rgb(13, 148, 136)";
    ctx.lineWidth = 15;
    ctx.lineCap = "round";
    ctx.stroke();

    ctx.font = "bold 2rem Outfit";
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-main').trim();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${Math.round(percentage * 100)}%`, x, y - 5);

    ctx.font = "500 0.875rem Inter";
    ctx.fillStyle = "var(--text-muted)";
    ctx.fillText(`${completed} of 12 Modules`, x, y + 25);
}

function renderAccuracyChart() {
    const canvas = document.getElementById("chart-quiz-accuracy");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = 300 * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    ctx.clearRect(0, 0, rect.width, 300);

    // Accuracy average values across all 12 modules
    const accuracies = [85, 90, 80, 100, 80, 95, 90, 85, 95, 80, 90, 85];
    const margin = 40;
    const graphWidth = rect.width - margin * 2;
    const graphHeight = 180;
    const barWidth = graphWidth / 12 - 10;

    ctx.beginPath();
    ctx.moveTo(margin, 230);
    ctx.lineTo(rect.width - margin, 230);
    ctx.strokeStyle = "var(--border-color)";
    ctx.stroke();

    accuracies.forEach((val, i) => {
        const hasPassed = appState.user.completedModules.includes((i + 1).toString());
        const displayVal = hasPassed ? val : 0;
        
        const x = margin + i * (graphWidth / 12) + 5;
        const height = (displayVal / 100) * graphHeight;
        const y = 230 - height;

        const gradient = ctx.createLinearGradient(x, y, x, 230);
        gradient.addColorStop(0, "rgb(59, 130, 246)");
        gradient.addColorStop(1, "rgba(59, 130, 246, 0.2)");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, height);

        ctx.font = "bold 0.7rem Inter";
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-main').trim();
        ctx.fillText(`${displayVal}%`, x + barWidth/2 - 10, y - 8);

        ctx.font = "600 0.65rem Outfit";
        ctx.fillStyle = "var(--text-muted)";
        ctx.fillText(`M${i+1}`, x + barWidth/2 - 8, 248);
    });
}

function renderXpHistoryChart() {
    const canvas = document.getElementById("chart-xp-history");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = 300 * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    ctx.clearRect(0, 0, rect.width, 300);

    const points = [0, 150, 300, 420, 650, appState.user.xp];
    const marginX = 50;
    const marginY = 50;
    const chartW = rect.width - marginX * 2;
    const chartH = 200;
    const maxVal = Math.max(...points, 800);

    ctx.strokeStyle = "rgba(226, 232, 240, 0.4)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const yGrid = marginY + (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(marginX, yGrid);
        ctx.lineTo(rect.width - marginX, yGrid);
        ctx.stroke();

        ctx.font = "0.75rem Inter";
        ctx.fillStyle = "var(--text-muted)";
        ctx.fillText(Math.round(maxVal - (maxVal / 4) * i), marginX - 35, yGrid + 4);
    }

    const coords = [];
    points.forEach((val, idx) => {
        const x = marginX + (chartW / (points.length - 1)) * idx;
        const y = marginY + chartH - (val / maxVal) * chartH;
        coords.push({ x, y });
    });

    ctx.beginPath();
    ctx.moveTo(coords[0].x, marginY + chartH);
    coords.forEach(pt => ctx.lineTo(pt.x, pt.y));
    ctx.lineTo(coords[coords.length - 1].x, marginY + chartH);
    ctx.closePath();
    
    const fillGradient = ctx.createLinearGradient(0, marginY, 0, marginY + chartH);
    fillGradient.addColorStop(0, "rgba(13, 148, 136, 0.25)");
    fillGradient.addColorStop(1, "rgba(13, 148, 136, 0.0)");
    ctx.fillStyle = fillGradient;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    coords.forEach(pt => ctx.lineTo(pt.x, pt.y));
    ctx.strokeStyle = "rgb(13, 148, 136)";
    ctx.lineWidth = 3;
    ctx.stroke();

    coords.forEach((pt, idx) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.strokeStyle = "rgb(13, 148, 136)";
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

// ==========================================
// 11. PRINTABLE CERTIFICATES
// ==========================================

function initCertificateView() {
    if (!appState.user) return;
    document.getElementById("cert-user-name").innerText = appState.user.name.toUpperCase();
    const hashId = Math.abs(appState.user.email.split("").reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0));
    document.getElementById("cert-verification-id").innerText = `ADR-QUEST-${hashId}`;
}

// ==========================================
// 12. LEADERBOARD SYSTEM
// ==========================================

function filterLeaderboard(period) {
    appState.currentLeaderboardTab = period;
    
    const tabs = ["weekly", "monthly", "alltime"];
    tabs.forEach(t => {
        const btn = document.getElementById(`tab-leaderboard-${t}`);
        if (btn) {
            btn.className = (t === period) ? "btn btn-secondary btn-sm" : "btn btn-outline btn-sm";
        }
    });

    const tbody = document.getElementById("leaderboard-rows");
    tbody.innerHTML = "";

    let players = [...appState.tempDb.users];
    players.sort((a, b) => b.xp - a.xp);

    players.forEach((player, index) => {
        const tr = document.createElement("tr");
        const rank = index + 1;
        
        let rankClass = "";
        let rankText = rank.toString();
        
        if (rank === 1) rankClass = "rank-gold", rankText = "🥇";
        else if (rank === 2) rankClass = "rank-silver", rankText = "🥈";
        else if (rank === 3) rankClass = "rank-bronze", rankText = "🥉";

        tr.innerHTML = `
            <td class="leaderboard-rank ${rankClass}">${rankText}</td>
            <td style="font-weight: 600;">${player.name} ${player.email === appState.user.email ? '<span style="font-size:0.75rem; color:var(--secondary);">(You)</span>' : ''}</td>
            <td>${player.role}</td>
            <td>Lvl ${player.level || Math.floor(player.xp/100)+1}</td>
            <td style="text-align: right; font-weight:700; color:var(--primary);">${player.xp} XP</td>
        `;
        tbody.appendChild(tr);
    });
}

// ==========================================
// 13. USER PROFILE CONTROLS
// ==========================================

function initProfileView() {
    if (!appState.user) return;
    
    document.getElementById("profile-avatar-view").innerText = appState.user.avatar || "👨‍⚕️";
    document.getElementById("profile-avatar-select").value = appState.user.avatar || "👨‍⚕️";
    document.getElementById("profile-name").value = appState.user.name;
    document.getElementById("profile-role").value = appState.user.role;
    document.getElementById("profile-new-password").value = "";
}

async function changeProfileAvatar() {
    const avatar = document.getElementById("profile-avatar-select").value;
    document.getElementById("profile-avatar-view").innerText = avatar;
    if (appState.user) {
        try {
            const data = await apiFetch("/api/auth/profile", {
                method: "POST",
                body: JSON.stringify({ avatar })
            });
            if (data.success) {
                appState.user = data.user;
                updateNavUserUi();
                showToast("Avatar updated successfully", "success");
            }
        } catch (err) {
            showToast("Failed to save avatar", "error");
        }
    }
}

async function handleProfileUpdate(event) {
    event.preventDefault();
    if (!appState.user) return;

    const newName = document.getElementById("profile-name").value.trim();
    const newPass = document.getElementById("profile-new-password").value;

    if (!newName) {
        showToast("Name cannot be empty", "error");
        return;
    }

    try {
        const payload = { name: newName };
        if (newPass) payload.password = newPass;

        const data = await apiFetch("/api/auth/profile", {
            method: "POST",
            body: JSON.stringify(payload)
        });

        if (data.success) {
            appState.user = data.user;
            updateNavUserUi();
            showToast("Profile settings saved successfully", "success");
            document.getElementById("profile-new-password").value = "";
        }
    } catch (err) {
        showToast("Failed to update profile settings: " + err.message, "error");
    }
}

// ==========================================
// 14. ADMIN TERMINAL CONTROL
// ==========================================

function initAdminDashboard() {
    document.getElementById("admin-metric-users").innerText = appState.tempDb.users.length;
    document.getElementById("admin-metric-reports").innerText = appState.tempDb.reports.length;
    
    renderAdminUsersList();
    renderAdminReportsList();
    
    setTimeout(() => {
        renderAdminAnalytics();
    }, 100);
}

function renderAdminUsersList() {
    const tbody = document.getElementById("admin-users-rows");
    tbody.innerHTML = "";

    appState.tempDb.users.forEach(u => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.role}</td>
            <td>Lvl ${u.level || 1}</td>
            <td style="font-weight:700;">${u.xp} XP</td>
        `;
        tbody.appendChild(tr);
    });
}

function filterAdminUsers() {
    const query = document.getElementById("admin-user-search").value.toLowerCase();
    const tbody = document.getElementById("admin-users-rows");
    tbody.innerHTML = "";

    appState.tempDb.users.forEach(u => {
        if (u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.role}</td>
                <td>Lvl ${u.level || 1}</td>
                <td style="font-weight:700;">${u.xp} XP</td>
            `;
            tbody.appendChild(tr);
        }
    });
}

function renderAdminReportsList() {
    const tbody = document.getElementById("admin-reports-rows");
    tbody.innerHTML = "";

    appState.tempDb.reports.forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="font-family:monospace; font-weight:700;">${r.refId}</td>
            <td>${r.patient}</td>
            <td>${r.drug}</td>
            <td>${r.reaction}</td>
            <td>${r.severity}</td>
        `;
        tbody.appendChild(tr);
    });
}

function switchAdminTab(subview) {
    document.querySelectorAll(".admin-subview").forEach(el => el.style.display = "none");
    document.querySelectorAll(".admin-menu-item").forEach(item => item.classList.remove("active"));
    
    document.getElementById(`admin-view-${subview}`).style.display = "block";
    event.currentTarget.classList.add("active");

    if (subview === "analytics") {
        setTimeout(() => {
            renderAdminAnalytics();
        }, 100);
    }
}

function renderAdminAnalytics() {
    const canvas = document.getElementById("admin-analytics-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = 300 * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    ctx.clearRect(0, 0, rect.width, 300);

    const values = [5, 4, 3, 2];
    const labels = ["Mild", "Mod", "Sev", "Crit"];
    const margin = 40;
    const chartW = rect.width - margin * 2;
    const chartH = 180;
    const barW = chartW / 4 - 30;

    ctx.beginPath();
    ctx.moveTo(margin, 230);
    ctx.lineTo(rect.width - margin, 230);
    ctx.strokeStyle = "var(--border-color)";
    ctx.stroke();

    values.forEach((val, i) => {
        const x = margin + i * (chartW / 4) + 15;
        const height = (val / 6) * chartH;
        const y = 230 - height;

        ctx.fillStyle = "rgb(13, 148, 136)";
        ctx.fillRect(x, y, barW, height);

        ctx.font = "bold 0.875rem Inter";
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-main').trim();
        ctx.fillText(val, x + barW/2 - 4, y - 8);

        ctx.font = "bold 0.8' Outfit";
        ctx.fillStyle = "var(--text-muted)";
        ctx.fillText(labels[i], x + barW/2 - 12, 248);
    });
}

function exportAdminData(type) {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (type === "users") {
        csvContent += "Name,Email,Role,XP,Level\n";
        appState.tempDb.users.forEach(u => {
            csvContent += `"${u.name}","${u.email}","${u.role}",${u.xp},${u.level}\n`;
        });
    } else {
        csvContent += "Ref ID,Patient,Suspected Drug,Adverse Reaction,Severity\n";
        appState.tempDb.reports.forEach(r => {
            csvContent += `"${r.refId}","${r.patient}","${r.drug}","${r.reaction}","${r.severity}"\n`;
        });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `adr_quest_${type}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${type} dataset as CSV`, "success");
}

// ==========================================
// 15. 60-DAY STUDY PLANNER & AI VIDEO PLAYER
// ==========================================

const STUDY_DAYS = [];
// Generate 60 days of course planner programmatically mapping to the 12 modules
// 5 days per module maps 60 days cleanly across 12 modules!
for (let d = 1; d <= 60; d++) {
    const moduleId = Math.min(Math.floor((d - 1) / 5) + 1, 12);
    const dayInModule = ((d - 1) % 5) + 1;
    const modData = MODULES_DATA.find(m => m.id === moduleId);
    const quizQ = modData.quiz[(dayInModule - 1) % modData.quiz.length];
    
    STUDY_DAYS.push({
        day: d,
        moduleId: moduleId,
        title: `Day ${d}: ${modData.title} (Check ${dayInModule})`,
        task: `Review clinical lessons under Module ${moduleId}. Focus on study topic: "${modData.lessons[0].title}". Watch 15 minutes of the AI video lecture and review reference files.`,
        mcq: {
            question: quizQ.question,
            options: quizQ.options,
            correctIndex: quizQ.correctIndex,
            explanation: quizQ.explanation
        }
    });
}

const TRANSCRIPTS_DATABASE = {
    1: [
        { time: 0, text: "Welcome to Module 1: Introduction to Pharmacovigilance. I am Dr. AI Vance, your safety instructor." },
        { time: 10, text: "In this session, we will review the historical milestones of drug safety, starting with the Thalidomide disaster of the late 1950s." },
        { time: 25, text: "This crisis led to severe limb malformations in over ten thousand infants globally and triggered modern drug trials regulations." },
        { time: 40, text: "We will also address underreporting, where less than ten percent of severe reactions are formally documented." },
        { time: 55, text: "Ensure you study spontaneous reporting schemas like FDA MedWatch and the UK Yellow Card. Let's begin." }
    ],
    2: [
        { time: 0, text: "Welcome back. In Module 2, we dive into the mechanisms of Adverse Drug Reactions." },
        { time: 10, text: "The Rawlins-Thompson classification divides reactions into Type A (Augmented) and Type B (Bizarre)." },
        { time: 25, text: "Type A reactions are predictable, dose-dependent, and common, such as hypoglycemia from insulin." },
        { time: 40, text: "Type B reactions are unpredictable, dose-independent, and carry higher mortality, like penicillin-induced anaphylaxis." },
        { time: 55, text: "We will also look at types C through F, covering chronic, delayed, withdrawal, and failure responses." }
    ],
    3: [
        { time: 0, text: "Hello. Module 3 focuses on High-Risk Medication Classes and High-Alert Drugs." },
        { time: 15, text: "Medications like anticoagulants, insulins, and narrow therapeutic index agents bear the highest error rates." },
        { time: 30, text: "Narrow Therapeutic Index drugs, such as Digoxin or Gentamicin, require strict therapeutic drug monitoring." },
        { time: 45, text: "Always measure patient serum levels to avoid severe cardiotoxicity, ototoxicity, or renal tubular necrosis." }
    ],
    4: [
        { time: 0, text: "In Module 4, we examine vulnerable patient groups: geriatrics, pediatrics, and pharmacogenomics." },
        { time: 15, text: "Geriatric patients experience altered renal clearance and polypharmacy, making them highly susceptible to falls." },
        { time: 30, text: "Neonates have immature liver glucuronidation, famously leading to Chloramphenicol accumulation and Grey Baby Syndrome." },
        { time: 45, text: "Genomics, such as the HLA-B allele tracking, helps prevent severe hypersensitivity before starting drug treatments." }
    ],
    5: [
        { time: 0, text: "Welcome to Module 5: Clinical Causality Assessment." },
        { time: 15, text: "We utilize structured scoring questionnaires like the Naranjo Algorithm to evaluate drug side effects probability." },
        { time: 30, text: "Naranjo scores calculate temporal associations, improvement on withdrawal (dechallenge), and recurrence upon exposure (rechallenge)." },
        { time: 45, text: "Remember, clinical re-challenge is strictly contraindicated in severe life-threatening reactions." }
    ],
    6: [
        { time: 0, text: "In Module 6, we discuss international reporting standards and spontaneous databases." },
        { time: 15, text: "Spontaneous reports aggregate data globally into WHO's VigiBase to detect rare, long-term safety signals." },
        { time: 30, text: "Remember the four mandatory items for any ADR report: patient identifiers, suspect drug, event description, and reporter details." },
        { time: 45, text: "Spontaneous databases use statistical ratios like reporting odds ratios to flag new warnings." }
    ],
    7: [
        { time: 0, text: "Module 7 addresses clinical safety mitigation and electronic order entry systems." },
        { time: 15, text: "REMS programs ensure high-risk drug benefits outweigh their toxic outcomes through regular lab registries." },
        { time: 30, text: "Medication reconciliation audits completed during admissions prevent prescribing discrepancies and errors." },
        { time: 45, text: "Electronic health record warnings are useful but can cause alert fatigue if not set up correctly." }
    ],
    8: [
        { time: 0, text: "Welcome to Module 8: Complex Case Studies and polypharmacy." },
        { time: 15, text: "The 'Triple Whammy' describes the fatal combination of an ACE inhibitor, a diuretic, and an NSAID." },
        { time: 30, text: "This cocktail constricts afferent renal flow and dilates efferent flow, precipitating acute tubular failure." },
        { time: 45, text: "We will also review Serotonin Syndrome diagnostic criteria like the Hunter Criteria. Let's finish strong." }
    ],
    9: [
        { time: 0, text: "Module 9 reviews medical informatics tools and digital safety databases." },
        { time: 15, text: "We study active surveillance checks where safety algorithms scan electronic records in real-time." },
        { time: 30, text: "Natural Language Processing (NLP) models mine narrative clinical notes for hidden drug side effects." },
        { time: 45, text: "These tools allow database miners to flag safety alerts much faster than voluntary spontaneous systems." }
    ],
    10: [
        { time: 0, text: "Welcome to Module 10: Pharmacoeconomic assessments of ADR events." },
        { time: 15, text: "Direct medical costs increase hospital stay duration and require expensive laboratory diagnostics." },
        { time: 30, text: "By tracking direct and indirect cost metrics, we justify institutional budgets for safety system investments." },
        { time: 45, text: "Cost-benefit analyses demonstrate positive clinical returns for medication double-check systems." }
    ],
    11: [
        { time: 0, text: "Hello. Module 11 focuses on biologicals and immunotherapeutic vaccine safety." },
        { time: 15, text: "Biological products can induce Anti-Drug Antibodies, neutralizing efficacy and causing infusion reactions." },
        { time: 30, text: "Specialized monitoring systems like VAERS collect post-marketing immunization data." },
        { time: 45, text: "Vaccines are evaluated closely since they are administered to healthy patient populations." }
    ],
    12: [
        { time: 0, text: "Welcome to Module 12: Professional clinical ethics and safety culture." },
        { time: 15, text: "Disclosing medication errors to patients and families is a crucial ethical responsibility." },
        { time: 30, text: "We conduct Root Cause Analyses to look for systemic errors instead of placing individual blame." },
        { time: 45, text: "A robust Just Culture encourages error reporting, making health systems safer for everyone." }
    ]
};

// State for AI video player
let videoState = {
    playing: false,
    currentTime: 0,
    duration: 60,
    interval: null,
    speed: 1,
    canvasInterval: null
};

// Render 60-day study planner (scaled to 12 modules)
function renderStudyPlanner() {
    const box = document.getElementById("study-planner-grid-box");
    if (!box) return;
    box.innerHTML = "";

    // Math calculation for current day based on 12 modules completion count
    // Completing a module (1 to 12) unlocks the next 5 days of curriculum
    const completedCount = appState.user.completedModules.length;
    const currentActiveDay = Math.min((completedCount * 5) + 1, 60);

    for (let w = 1; w <= 12; w++) {
        const weekDiv = document.createElement("div");
        weekDiv.innerHTML = `<h4 class="planner-week-title">Week ${w}: ${WEEK_THEME_LABEL(w)}</h4>`;
        
        const grid = document.createElement("div");
        grid.className = "planner-grid";

        for (let d = (w - 1) * 5 + 1; d <= w * 5; d++) {
            if (d > 60) break;

            const dayBtn = document.createElement("button");
            
            let status = "locked";
            if (d < currentActiveDay) {
                status = "completed";
            } else if (d === currentActiveDay) {
                status = "active";
            }

            dayBtn.className = `planner-day-btn ${status === 'completed' ? 'completed' : ''} ${status === 'active' ? 'active-day' : ''} ${status === 'locked' ? 'locked' : ''}`;
            dayBtn.innerHTML = `
                <span class="day-label">Day</span>
                <span>${d}</span>
                ${status === 'completed' ? '<i class="fa-solid fa-check" style="font-size:0.7rem;"></i>' : ''}
            `;

            dayBtn.onclick = () => clickPlannerDay(d, status);
            grid.appendChild(dayBtn);
        }
        weekDiv.appendChild(grid);
        box.appendChild(weekDiv);
    }
}

function WEEK_THEME_LABEL(w) {
    const labels = [
        "Pharmacovigilance Scope",
        "Mechanisms & Predictability",
        "NTI & High-Alert Drugs",
        "Neonatal & Geriatric Safety",
        "Naranjo Causality Assessment",
        "MedWatch & Spontaneous Portals",
        "REMS & Reconciliation",
        "Causality Case Studies",
        "Informatics & NLP Models",
        "Economics & ICU Costs",
        "Biologicals & Immunogenicity",
        "Ethics & System RCA"
    ];
    return labels[w - 1] || "Clinical Case Studies";
}

function clickPlannerDay(day, status) {
    if (status === "locked") {
        showToast("Day locked. Complete previous modules to unlock today's path.", "warning");
        return;
    }

    const dayData = STUDY_DAYS.find(s => s.day === day);
    if (!dayData) return;

    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.style.display = "flex";

    modal.innerHTML = `
        <div class="glass-card modal-card" style="max-width: 650px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; border-bottom:1px solid var(--border-color); padding-bottom:0.75rem;">
                <h3 style="color:var(--primary);"><i class="fa-solid fa-book-medical"></i> ${dayData.title}</h3>
                <i class="fa-solid fa-xmark" style="cursor:pointer; font-size:1.25rem;" onclick="this.parentElement.parentElement.parentElement.remove()"></i>
            </div>
            
            <h4 style="margin-bottom:0.5rem;">Daily Learning Checklist:</h4>
            <p style="background:var(--background); padding:1rem; border-radius:var(--radius-md); font-size:0.9rem; margin-bottom:2rem; border-left:4px solid var(--secondary);">
                ${dayData.task}
            </p>

            <h4 style="margin-bottom:0.5rem;"><i class="fa-solid fa-clipboard-question"></i> Daily Review MCQ:</h4>
            <div id="planner-mcq-box" style="margin-bottom:2rem;">
                <p style="font-weight:600; margin-bottom:1rem;">${dayData.mcq.question}</p>
                <div class="quiz-options" id="planner-options-box">
                    ${dayData.mcq.options.map((opt, idx) => `
                        <div class="quiz-option" onclick="submitPlannerDayMcq(this, ${idx}, ${day})">${opt}</div>
                    `).join('')}
                </div>
                <div id="planner-feedback-inline" style="display:none; margin-top:1.5rem; padding:1rem; border-radius:var(--radius-md);"></div>
            </div>

            <div style="text-align:right;">
                <button class="btn btn-primary btn-sm" onclick="this.parentElement.parentElement.parentElement.remove(); navigateTo('learning');">Go to Learning Modules</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function submitPlannerDayMcq(btn, index, day) {
    const parent = document.getElementById("planner-options-box");
    if (parent.querySelector(".correct") || parent.querySelector(".incorrect")) return;

    const dayData = STUDY_DAYS.find(s => s.day === day);
    const feedback = document.getElementById("planner-feedback-inline");

    const options = parent.querySelectorAll(".quiz-option");
    options.forEach((opt, idx) => {
        if (idx === dayData.mcq.correctIndex) {
            opt.classList.add("correct");
        } else if (idx === index) {
            opt.classList.add("incorrect");
        }
    });

    feedback.style.display = "block";
    if (index === dayData.mcq.correctIndex) {
        feedback.className = "correct";
        feedback.style.background = "rgba(34, 197, 94, 0.1)";
        feedback.style.border = "1px solid var(--success)";
        feedback.innerHTML = `<strong>Correct! +10 XP</strong>. ${dayData.mcq.explanation}`;
        awardXp(10);
    } else {
        feedback.className = "incorrect";
        feedback.style.background = "rgba(239, 68, 68, 0.1)";
        feedback.style.border = "1px solid var(--danger)";
        feedback.innerHTML = `<strong>Incorrect</strong>. The correct answer was: "${dayData.mcq.options[dayData.mcq.correctIndex]}". ${dayData.mcq.explanation}`;
    }
}

// Switch tabs inside the learning section
function switchLearningSection(section) {
    document.getElementById("lesson-read-panel").style.display = "none";
    document.getElementById("lesson-video-panel").style.display = "none";
    document.getElementById("module-quiz-panel").style.display = "none";
    document.getElementById("lesson-resources-panel").style.display = "none";

    document.getElementById("tab-learn-read").classList.remove("active-tab");
    document.getElementById("tab-learn-video").classList.remove("active-tab");
    document.getElementById("tab-learn-quiz").classList.remove("active-tab");
    document.getElementById("tab-learn-resources").classList.remove("active-tab");

    if (section === "read") {
        document.getElementById("lesson-read-panel").style.display = "block";
        document.getElementById("tab-learn-read").classList.add("active-tab");
        resetVideoPlayback();
    } else if (section === "video") {
        document.getElementById("lesson-video-panel").style.display = "block";
        document.getElementById("tab-learn-video").classList.add("active-tab");
        loadVideoTranscript();
        renderVideoChapters(); // Render chapter navigation bookmarks
    } else if (section === "quiz") {
        const currentModule = MODULES_DATA.find(m => m.id === appState.currentModuleId);
        launchModuleQuiz(currentModule);
        document.getElementById("tab-learn-quiz").classList.add("active-tab");
        resetVideoPlayback();
    } else if (section === "resources") {
        document.getElementById("lesson-resources-panel").style.display = "block";
        document.getElementById("tab-learn-resources").classList.add("active-tab");
        loadExternalResources();
        resetVideoPlayback();
    }
}

// Load transcripts for active module video
function loadVideoTranscript() {
    const list = TRANSCRIPTS_DATABASE[appState.currentModuleId] || [];
    const container = document.getElementById("lecture-transcript-box");
    if (!container) return;
    container.innerHTML = "";

    const activeMod = MODULES_DATA.find(m => m.id === appState.currentModuleId);
    document.getElementById("video-lecture-title").innerText = `AI Video Lecture: ${activeMod.title}`;

    list.forEach(line => {
        const div = document.createElement("div");
        div.className = "transcript-line";
        div.setAttribute("data-time", line.time);
        div.innerHTML = `<span style="color:var(--secondary); font-weight:700;">[00:${line.time.toString().padStart(2, '0')}]</span> ${line.text}`;
        div.onclick = () => jumpToVideoTime(line.time);
        container.appendChild(div);
    });
}

// Render Video Chapters Navigation Bookmarks
function renderVideoChapters() {
    const box = document.getElementById("video-chapters-box");
    if (!box) return;
    box.innerHTML = "";

    const chapters = CHAPTERS_DATABASE[appState.currentModuleId] || [];
    chapters.forEach(chap => {
        const btn = document.createElement("button");
        btn.className = "btn btn-outline btn-sm";
        btn.style.fontSize = "0.75rem";
        btn.style.padding = "0.25rem 0.5rem";
        btn.innerHTML = `<i class="fa-solid fa-bookmark"></i> ${chap.name} <span style="opacity:0.6;">(00:${chap.start.toString().padStart(2, '0')})</span>`;
        btn.onclick = () => jumpToVideoTime(chap.start);
        box.appendChild(btn);
    });
}

function jumpToVideoTime(seconds) {
    videoState.currentTime = seconds;
    updateVideoTimelineFill();
    highlightTranscriptLine();
    showToast(`Jumped video to 00:${seconds.toString().padStart(2, '0')}`, "info");
}

function toggleVideoPlayback() {
    const btn = document.getElementById("video-play-btn");
    const avatar = document.getElementById("lecture-avatar");

    if (videoState.playing) {
        // Pause
        videoState.playing = false;
        btn.innerHTML = '<i class="fa-solid fa-play"></i>';
        if (avatar) avatar.classList.remove("avatar-talking");
        clearInterval(videoState.interval);
        clearInterval(videoState.canvasInterval);
    } else {
        // Play
        videoState.playing = true;
        btn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        if (avatar) avatar.classList.add("avatar-talking");

        videoState.interval = setInterval(() => {
            videoState.currentTime += videoState.speed;
            if (videoState.currentTime >= videoState.duration) {
                videoState.currentTime = videoState.duration;
                toggleVideoPlayback(); // Pause at end
                showToast("AI Lecture complete! +10 XP awarded.", "success");
                awardXp(10);
            }
            updateVideoTimelineFill();
            highlightTranscriptLine();
        }, 1000);

        startLectureVisualizer();
    }
}

function resetVideoPlayback() {
    videoState.playing = false;
    videoState.currentTime = 0;
    clearInterval(videoState.interval);
    clearInterval(videoState.canvasInterval);

    const btn = document.getElementById("video-play-btn");
    const avatar = document.getElementById("lecture-avatar");
    if (btn) btn.innerHTML = '<i class="fa-solid fa-play"></i>';
    if (avatar) avatar.classList.remove("avatar-talking");

    updateVideoTimelineFill();
    
    const canvas = document.getElementById("lecture-visualizer");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function changeVideoSpeed() {
    const select = document.getElementById("video-speed-select");
    if (select) {
        videoState.speed = parseFloat(select.value);
    }
}

function seekVideo(event) {
    const timeline = document.getElementById("video-timeline");
    if (!timeline) return;
    
    const rect = timeline.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    
    videoState.currentTime = Math.round(percentage * videoState.duration);
    updateVideoTimelineFill();
    highlightTranscriptLine();
}

function updateVideoTimelineFill() {
    const fill = document.getElementById("video-timeline-fill");
    if (fill) {
        const pct = (videoState.currentTime / videoState.duration) * 100;
        fill.style.width = `${pct}%`;
    }
}

function highlightTranscriptLine() {
    const list = TRANSCRIPTS_DATABASE[appState.currentModuleId] || [];
    const elements = document.querySelectorAll(".transcript-line");

    let activeIndex = -1;
    for (let i = 0; i < list.length; i++) {
        if (videoState.currentTime >= list[i].time) {
            activeIndex = i;
        }
    }

    elements.forEach((el, index) => {
        el.classList.remove("active-line");
        if (index === activeIndex) {
            el.classList.add("active-line");
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

function startLectureVisualizer() {
    const canvas = document.getElementById("lecture-visualizer");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth;
    canvas.height = 60;

    let offset = 0;

    videoState.canvasInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = "rgba(20, 184, 166, 0.4)";
        ctx.lineWidth = 2;
        ctx.beginPath();

        // Draw double sine wave visualizer representing speech waveform
        for (let x = 0; x < canvas.width; x++) {
            const y = canvas.height / 2 + Math.sin(x * 0.05 + offset) * 15 * Math.sin(offset * 0.02);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.strokeStyle = "rgba(59, 130, 246, 0.2)";
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
            const y = canvas.height / 2 + Math.cos(x * 0.04 - offset) * 10 * Math.sin(offset * 0.01);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        offset += 0.15;
    }, 30);
}

// Load YouTube references external resources
function loadExternalResources() {
    const container = document.getElementById("youtube-resources-list");
    if (!container) return;
    container.innerHTML = "";

    const list = YOUTUBE_RESOURCES_DATABASE[appState.currentModuleId] || [];
    if (list.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:var(--text-muted);">No reference links listed for this module.</p>`;
        return;
    }

    list.forEach(item => {
        const card = document.createElement("div");
        card.className = "glass-card";
        card.style.padding = "1.5rem";
        card.style.borderLeft = "4px solid red"; // YouTube indicator red line
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                    <h4 style="margin:0 0 0.5rem; font-size:1.1rem; color:var(--text-main);"><i class="fa-brands fa-youtube" style="color:red; margin-right:0.5rem;"></i> ${item.title}</h4>
                    <p style="font-size:0.875rem; color:var(--text-muted); margin:0 0 1rem;">${item.desc}</p>
                </div>
                <a href="${item.url}" target="_blank" class="btn btn-secondary btn-sm" style="background:red;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Watch Video</a>
            </div>
        `;
        container.appendChild(card);
    });
}
