JUCE Scraper
============

Micro service REST API to look up the status of a process on the Junta Comercial (Board of Trade).

Juntas Comerciais Suportadas
----------------------------

-	[CIESP](https://www.jucespciesp.com.br)
-	[JUCEC](http://vpn2.jucec.ce.gov.br)
-	[JUCEES](https://www.jucees.es.gov.br)
-	[JUCEG](http://servicos.juceg.go.gov.br)
-	[JUCEMG](http://www.jucemg.mg.gov.br)
-	[JUCEMS](https://jucems.ms.gov.br)
-	[JUCEPA](http://www.jucepa.pa.gov.br)
-	[JUCERGS](http://www.jucergs.rs.gov.br)
-	[JUCERJA](https://www.jucerja.rj.gov.br)
-	[JUCESC](http://sistemas2.jucesc.sc.gov.br)
-	[JUCESE](https://www.jucese.se.gov.br)
-	[JUCESP](https://www.jucesp.sp.gov.br)

Exemplos de consulta
--------------------

#### São Paulo (CIESP / JUCESP)

-	[CIESP](http://juce-scraper.herokuapp.com/ciesp/0543484154)
-	[JUCESP](http://juce-scraper.herokuapp.com/jucesp/0543484154)

#### Espirito Santo (JUCEES)

-	[Consulta de aprovado](https://www.jucees.es.gov.br/consulta/processo.php?nrproc=147802806)
-	[Consulta de reprovado](https://www.jucees.es.gov.br/consulta/processo.php?nrproc=140440879)
-	[Consulta de aguardando](https://www.jucees.es.gov.br/consulta/processo.php?nrproc=140031740)

Run with AZK
------------

1.	Install AZK

	http://docs.azk.io/en/installation

2.	Run the application

	`azk start`

Run without AZK
---------------

1.	Install Node.js

	https://nodejs.org/download

2.	Install dependencies

	`npm install`

3.	Run the application

	`node app.js`
