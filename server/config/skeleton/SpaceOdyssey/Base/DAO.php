<?php

/** @var \Skeleton\Base\IBoneConstructor $this */

$this->set(\SpaceOdyssey\Base\DAO\IUserDAO::class, \SpaceOdyssey\DAO\UserDAO::class);
$this->set(\SpaceOdyssey\Base\DAO\ISessionDAO::class, \SpaceOdyssey\DAO\SessionDAO::class);
$this->set(\SpaceOdyssey\Base\DAO\ILogDAO::class, \SpaceOdyssey\DAO\LogDAO::class);
$this->set(\SpaceOdyssey\Base\DAO\IPartyDAO::class, \SpaceOdyssey\DAO\PartyDAO::class);
$this->set(\SpaceOdyssey\Base\DAO\IPartyMemberDAO::class, \SpaceOdyssey\DAO\PartyMemberDAO::class);
$this->set(\SpaceOdyssey\Base\DAO\IPersonalityDAO::class, \SpaceOdyssey\DAO\PersonalityDAO::class);
$this->set(\SpaceOdyssey\Base\DAO\IPersonalTraitDAO::class, \SpaceOdyssey\DAO\PersonalTraitDAO::class);
$this->set(\SpaceOdyssey\Base\DAO\ISkillDAO::class, \SpaceOdyssey\DAO\SkillDAO::class);