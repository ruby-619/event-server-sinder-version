-- 資料表結構 `token-session`
--

CREATE TABLE `token-session` (
     `sid` int(11) NOT NULL,
     `member_sid` int(11) NOT NULL,
     `token` varchar(1000) NOT NULL,
     `payload` varchar(1000) NOT NULL,
     `created_at` datetime NOT NULL,
     `visited_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 資料表索引 `token-session`
--
ALTER TABLE `token-session`
    ADD PRIMARY KEY (`sid`),
  ADD KEY `token` (`token`(191)),
  ADD KEY `member_sid` (`member_sid`);

--
-- 使用資料表自動增長(AUTO_INCREMENT) `token-session`
--
ALTER TABLE `token-session`
    MODIFY `sid` int(11) NOT NULL AUTO_INCREMENT;