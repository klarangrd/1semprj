-- We only needed the numbers from the area around the Caribbean, so every other region is sorted out 
DELETE FROM shark_tmp
WHERE region_name != 'Western Atlantic';

-- All data was from the beginning formatet as text
-- Then we made the years in both tables into integers
ALTER TABLE lionfish_tmp
ALTER COLUMN "year" TYPE INT 
USING "year"::integer;

ALTER TABLE shark_tmp
ALTER COLUMN trip_year TYPE INT 
USING trip_year::integer;

-- We want to compare the population numbers from both lionfish and reefshark
-- Then we insert the years together with every fish' respective population number
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

-- Here we create a view, which can be used to fetch the coordinates for the lionfish
CREATE VIEW kordinater AS
SELECT lionfish_tmp.longetude,lionfish_tmp.latitude
FROM lionfish_tmp;

-- Our coordinates in the dataset are formattet wrong, there are a lot of extra commas
-- and commas in the wrong places, so we firstly remove all commas and then insert them again after
-- the second and third character respectively. This depends on whether it is longitude or latitude
UPDATE lionfish_tmp
SET latitude = left(translate(latitude, '.', ''), 2) || '.' || right(translate(latitude, '.', ''), -2)

UPDATE lionfish_tmp
SET longitude = left(translate(longitude, '.', ''), 3) || '.' || right(translate(longitude, '.', ''), -3)

