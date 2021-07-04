<?php

$hash = '$2y$10$6Ps.MLbQj0S53HSM0BOs.eWniXLbT8bzgwewwEg3ydVAhLdYL4.ym';
echo password_verify('123456',  $hash) ? 'yes' : 'no';