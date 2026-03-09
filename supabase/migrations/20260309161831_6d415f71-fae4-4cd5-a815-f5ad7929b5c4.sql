UPDATE subscriptions SET
  paper_credits_total = CASE
    WHEN plan = 'starter' THEN 5000
    WHEN plan = 'researcher' THEN 25000
    ELSE paper_credits_total
  END,
  dataset_credits_total = CASE
    WHEN plan = 'starter' THEN 5000
    WHEN plan = 'researcher' THEN 25000
    ELSE dataset_credits_total
  END,
  analysis_credits_total = CASE
    WHEN plan = 'starter' THEN 5000
    WHEN plan = 'researcher' THEN 35000
    ELSE analysis_credits_total
  END
WHERE paper_credits_total < 1000;