JUCE Scraper
============

Micro service REST API to look up the status of a process on the Junta Comercial (Board of Trade).

Juntas Comerciais
-----------------

1.	Acre (não suportada)

2.	Alagoas (não suportada)

3.	Amapá (não suportada)

4.	Amazonas (não suportada)

5.	Bahia (não suportada)

6.	[Ceará (JUCEC)](http://vpn2.jucec.ce.gov.br)

7.	[Distrito Federal (JCDF)](http://jcdf.smpe.gov.br)

8.	[Espírito Santo (JUCEES)](https://www.jucees.es.gov.br)

9.	[Goiás (JUCEG)](http://servicos.juceg.go.gov.br)

10.	Maranhão (não suportada)

11.	Mato Grosso (não suportada)

12.	[Mato Grosso do Sul (JUCEMS)](https://jucems.ms.gov.br)

13.	[Minas Gerais (JUCEMG)](http://www.jucemg.mg.gov.br)

14.	[Pará (JUCEPA)](http://www.jucepa.pa.gov.br)

15.	Paraíba (não suportada)

16.	Paraná (não suportada)

17.	Pernambuco (não suportada)

18.	Piauí (não suportada)

19.	Rio Grande do Norte (não suportada)

20.	[Rio Grande do Sul (JUCERGS)](http://www.jucergs.rs.gov.br)

21.	[Rio de Janeiro (JUCERJA)](https://www.jucerja.rj.gov.br)

22.	Rondônia (não suportada)

23.	Roraima (não suportada)

24.	[Santa Catarina](http://sistemas2.jucesc.sc.gov.br)

25.	São Paulo

	-	[JUCESP](https://www.jucesp.sp.gov.br)
	-	[CIESP](https://www.jucespciesp.com.br)

26.	[Sergipe](https://www.jucese.se.gov.br)

27.	Tocantins (não suportada)

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
