-- Vi skulle kun bruge tal fra området omkring karibien, så alle andre regioner sorteres fra
DELETE FROM shark_tmp
WHERE region_name != 'Western Atlantic';

-- Alt data var som udgangspunkt formateret som tekst
-- så vi lavede årstallene i begge tabeller om til integers
ALTER TABLE lionfish_tmp
ALTER COLUMN "year" TYPE INT 
USING "year"::integer;

ALTER TABLE shark_tmp
ALTER COLUMN trip_year TYPE INT 
USING trip_year::integer;

-- Vi vil gerne sammenligne populationstallene for både dragefisk og hajer
-- så her indsætter vi et årstal sammen med hver fisk's respektive befolkningstal
INSERT INTO populationdata ("year",lionfish_pop,shark_pop)
VALUES (2010,(SELECT COUNT("year") FROM lionfish_tmp WHERE "year" = 2010),(SELECT COUNT(trip_year) FROM shark_tmp WHERE trip_year = 2010)),
(2011,(SELECT COUNT("year") FROM lionfish_tmp WHERE "year" = 2011 OR year < 2011),(SELECT COUNT(trip_year) FROM shark_tmp WHERE trip_year = 2011)),
(2012,(SELECT COUNT("year") FROM lionfish_tmp WHERE "year" = 2012 OR year < 2012),(SELECT COUNT(trip_year) FROM shark_tmp WHERE trip_year = 2012)),
(2013,(SELECT COUNT("year") FROM lionfish_tmp WHERE "year" = 2013 OR year < 2013),(SELECT COUNT(trip_year) FROM shark_tmp WHERE trip_year = 2013)),
(2014,(SELECT COUNT("year") FROM lionfish_tmp WHERE "year" = 2014 OR year < 2014),(SELECT COUNT(trip_year) FROM shark_tmp WHERE trip_year = 2014)),
(2015,(SELECT COUNT("year") FROM lionfish_tmp WHERE "year" = 2015 OR year < 2015),(SELECT COUNT(trip_year) FROM shark_tmp WHERE trip_year = 2015)),
(2016,(SELECT COUNT("year") FROM lionfish_tmp WHERE "year" = 2016 OR year < 2016),(SELECT COUNT(trip_year) FROM shark_tmp WHERE trip_year = 2016)),
(2017,(SELECT COUNT("year") FROM lionfish_tmp WHERE "year" = 2017 OR year < 2017),(SELECT COUNT(trip_year) FROM shark_tmp WHERE trip_year = 2017)),
(2018,(SELECT COUNT("year") FROM lionfish_tmp WHERE "year" = 2018 OR year < 2018),(SELECT COUNT(trip_year) FROM shark_tmp WHERE trip_year = 2018));

-- Her skaber vi et view, som kan bruges til at hente kordinater for dragefiskene ud
CREATE VIEW kordinater AS
SELECT lionfish_tmp.longetude,lionfish_tmp.latitude
FROM lionfish_tmp;