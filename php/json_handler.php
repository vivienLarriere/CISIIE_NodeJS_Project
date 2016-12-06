<?php

$handle = fopen("C:\\Users\\Vivien\\www\\CISIIE\\Javascript\\CISIIE_NodeJS_Project\\save.json", "r+");
fwrite($handle, json_encode($_POST));
fclose($handle);