<?php
    /* 
        Tasty Digital updates required May 2024
	    There is one new indicator: “Networked Data - Transactions with valid receiver”.
		One indicator name has changed  - from ‘sub-national location’ to ‘location’.

        We use this to set up the wp options forms. 
        Relates to keys in the results.json ATI dataset.

    */
    
    $components_and_indicators = [
        [
            'title' => 'Organisational planning and commitments',
            'indicators' => [
	            'Quality of FOI legislation',
	            'Accessibility',
	            'Organisation strategy',
	            'Annual report',
	            'Allocation policy',
	            'Procurement policy',
	            'Strategy (country/sector) or Memorandum of Understanding',
	            'Audit'
            ]
        ],
        [
            'title' => 'Finance and budgets',
            'indicators' => [
	            'Total organisation budget',
	            'Disaggregated budget',
	            'Project budget',
	            'Project budget document',
	            'Commitments',
	            'Disbursements and expenditures',
	            'Budget Alignment'
            ]
        ],
        [
            'title' => 'Project attributes',
            'indicators'=> [
	            'Title',
	            'Description',
	            'Planned dates',
	            'Actual dates',
	            'Current status',
	            'Contact details',
	            'Sectors',
	            'Location',
	            'Conditions',
                'Unique ID' 
            ]
        ],
        [
            'title' => 'Joining-up development data',
            'indicators' => [
	            'Flow type',
	            'Aid type',
	            'Finance type',
	            'Tied aid status',
	            'Networked Data - Implementors',
	            'Networked Data - Participating Orgs',
	            'Networked Data - Transactions with valid receiver',
	            'Project procurement'
            ]
        ],
        [
            'title' => 'Performance',
            'indicators'  => [
	            'Objectives',
	            'Pre-project impact appraisals',
	            'Reviews and evaluations',
	            'Results'
            ]
        ]
    ];
    
    