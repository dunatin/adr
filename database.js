const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, 'data', 'db.json');
const DATA_DIR = path.dirname(DB_FILE);

let dbCached = null;

async function initDb() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (e) {
        // Directory already exists
    }

    try {
        const fileContent = await fs.readFile(DB_FILE, 'utf8');
        dbCached = JSON.parse(fileContent);
    } catch (error) {
        console.log("Database file not found or empty. Seeding database...");
        dbCached = await seedDb();
    }
}

async function writeDb() {
    const tempFile = `${DB_FILE}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(dbCached, null, 2), 'utf8');
    await fs.rename(tempFile, DB_FILE);
}

async function seedDb() {
    const adminPasswordHash = await bcrypt.hash("adminpassword123", 10);
    const studentPasswordHash = await bcrypt.hash("student123", 10);

    const defaultDb = {
        users: [
            {
                name: "Admin Officer",
                email: "admin@safety.com",
                role: "Admin",
                level: 10,
                xp: 5000,
                passwordHash: adminPasswordHash,
                college: "National Pharmacovigilance Board",
                badges: ["master-cert", "safety-reporter"],
                completedModules: ["1","2","3","4","5","6","7","8","9","10","11","12"],
                submittedReports: 4
            },
            {
                name: "Alex Mercer",
                email: "alex@medschool.edu",
                role: "Medical Student",
                level: 4,
                xp: 950,
                passwordHash: studentPasswordHash,
                college: "Harvard Medical School",
                badges: ["first-quiz"],
                completedModules: ["1"],
                submittedReports: 0
            },
            {
                name: "Sarah Jenkins",
                email: "sarah@pharmacy.net",
                role: "Clinical Pharmacist",
                level: 5,
                xp: 1200,
                passwordHash: studentPasswordHash,
                college: "UCSF Pharmacy School",
                badges: ["first-quiz"],
                completedModules: ["1","2"],
                submittedReports: 1
            }
        ],
        reports: [
            { refId: "ADR-10023", patient: "M.K., 62", drug: "Lisinopril", reaction: "Dry cough, angioedema of lips", severity: "Moderate Severity" },
            { refId: "ADR-10024", patient: "L.B., 28", drug: "Amoxicillin", reaction: "Maculopapular rash, pruritus", severity: "Mild Toxicity" }
        ],
        videos: [
            { id: "vid-1", moduleId: 1, title: "Introduction to Pharmacovigilance (WHO)", url: "https://www.youtube.com/watch?v=kYJqDCRzV7k", desc: "Learn the core guidelines and historical context of global drug safety directly from the World Health Organization." },
            { id: "vid-2", moduleId: 1, title: "Thalidomide: The Tragedy That Changed Drug Safety", url: "https://www.youtube.com/watch?v=4w2q55gT41M", desc: "A documentary review of the phocomelia crisis and the safety regulations that followed." },
            { id: "vid-3", moduleId: 2, title: "Classification of Adverse Drug Reactions", url: "https://www.youtube.com/watch?v=ZJd7bYQ81dM", desc: "A clinical pharmacology walkthrough on Rawlins-Thompson classes Type A to Type F." },
            { id: "vid-4", moduleId: 3, title: "Narrow Therapeutic Index Drugs & TDM", url: "https://www.youtube.com/watch?v=9g0H-S2s_2c", desc: "Understand blood concentration indices for Digoxin, Lithium, and Gentamicin." },
            { id: "vid-5", moduleId: 4, title: "Geriatric Pharmacology: Beers Criteria Basics", url: "https://www.youtube.com/watch?v=F08VlP70i7c", desc: "Review fall prevention and renal adjustments for older populations." },
            { id: "vid-6", moduleId: 5, title: "How to use the Naranjo Causality Algorithm", url: "https://www.youtube.com/watch?v=4d092mF58da", desc: "A clinical practice breakdown of scoring the temporal sequence, de-challenge, and re-challenge." },
            { id: "vid-7", moduleId: 6, title: "FDA MedWatch Reporting Tutorial", url: "https://www.youtube.com/watch?v=vVj487D_a88", desc: "MedWatch Form 3500 walkthrough. Learn how to log clinical errors." },
            { id: "vid-8", moduleId: 7, title: "REMS Programs & Risk Mitigation", url: "https://www.youtube.com/watch?v=84daN732mF8", desc: "Understand risk evaluation protocols and mandatory ANC registries." },
            { id: "vid-9", moduleId: 8, title: "The Renal Triple Whammy Interaction", url: "https://www.youtube.com/watch?v=Xn72a983bF8", desc: "A cardiovascular pharmacology lecture reviewing NSAIDs, Diuretics, and ACE inhibitor interactions." }
        ],
        modules: [
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
                    { title: "Root Cause Analysis (RCA)", content: "When a severe medication error or preventable ADR occurs, clinical team members perform a Root Cause Analysis (RCA). RCA is a structured retrospective safety check identifying underlying systemic failures (e.g. look-alike labeling, staffing shortages) rather than focusing blame on individual staff members." }
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
                        explanation: "Fear of blame, professional shame, and litigation are the primary causes of medication error concealment, highlighting the need for Just Culture."
                    }
                ]
            }
        ],
        dailyChallenges: [
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
        ],
        clinicalCases: [
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
        ],
        transcripts: {
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
        },
        chapters: {
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
        }
    };
    await fs.writeFile(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf8');
    return defaultDb;
}

async function getUsers() {
    return dbCached.users;
}

async function getUserByEmail(email) {
    return dbCached.users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

async function saveUser(user) {
    const idx = dbCached.users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (idx !== -1) {
        dbCached.users[idx] = { ...dbCached.users[idx], ...user };
    } else {
        dbCached.users.push(user);
    }
    await writeDb();
}

async function getModules() {
    return dbCached.modules;
}

async function saveModule(mod) {
    const idx = dbCached.modules.findIndex(m => m.id === Number(mod.id));
    if (idx !== -1) {
        dbCached.modules[idx] = { ...dbCached.modules[idx], ...mod };
    } else {
        dbCached.modules.push(mod);
    }
    await writeDb();
}

async function deleteModule(id) {
    dbCached.modules = dbCached.modules.filter(m => m.id !== Number(id));
    await writeDb();
}

async function getVideos() {
    return dbCached.videos;
}

async function saveVideo(video) {
    if (!video.id) {
        video.id = `vid-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    const idx = dbCached.videos.findIndex(v => v.id === video.id);
    if (idx !== -1) {
        dbCached.videos[idx] = { ...dbCached.videos[idx], ...video };
    } else {
        dbCached.videos.push(video);
    }
    await writeDb();
}

async function deleteVideo(id) {
    dbCached.videos = dbCached.videos.filter(v => v.id !== id);
    await writeDb();
}

async function getReports() {
    return dbCached.reports;
}

async function saveReport(report) {
    dbCached.reports.push(report);
    await writeDb();
}

async function getDailyChallenges() {
    return dbCached.dailyChallenges;
}

async function getClinicalCases() {
    return dbCached.clinicalCases;
}

async function getTranscripts() {
    return dbCached.transcripts;
}

async function getChapters() {
    return dbCached.chapters;
}

module.exports = {
    initDb,
    getUsers,
    getUserByEmail,
    saveUser,
    getModules,
    saveModule,
    deleteModule,
    getVideos,
    saveVideo,
    deleteVideo,
    getReports,
    saveReport,
    getDailyChallenges,
    getClinicalCases,
    getTranscripts,
    getChapters
};