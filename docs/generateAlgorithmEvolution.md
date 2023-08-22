Will replace generateTandemAlgorithm when ready.

Pre-requisites implementing changes in algorithm : 
- pair must be symetric (thus paire's score must be symetric)

# Global routine

```plantuml
start
:findAPairInThisLoop = false;

repeat
    :profilesToPair = Profiles from selected universities not in tandem;
    note
        May be updated in further time
        in order to manage several propositions
        or tandems per profile but excluding
        proposistions/tandems already made
    endnote


    group Generate possible pairs from profilesToPair
        :possiblePairs = [];
        repeat :profile1 = select next profile in profilesToPair;
            repeat :profile2 = select next profile in profilesToPair;
                if (profile1 != profile2 AND {profile1, profile2} NOT IN possiblePairs) then (yes)
                    if ({profile1, profile2} match forbidden condition OR (profile1 ET profile2) do not belong to central university) then (no) 
                        :score = computeScore(profile1, profile2);
                        if (score > scoreTreshold) then (yes)
                            :add ({profile1, profile2}, score) to possiblePairs;
                        else (no)
                        endif
                    else (yes)
                    endif
                else (no)
                endif
            repeat while (next profile2 in group B?)
        repeat while (next profile1 in group A?)
        :sortedPossiblePairs = sort possiblePairs by pair score;
    end group

    :sortedProfilesToPair = profilesToPair sorted by :
        1. Profiles following specific program 
        2. Personnal before student;
    note
        Clarification: we find a pair in priority for personnal,
        then for profiles following specific program
    endnote


    :createdPairs = [];
    group Global routine: find best combinaisons among possible pairs
        repeat :profile1 = select next profile1 in sortedProfilesToPair;
            :bestPairForProfile = find first pair containing profile1 in sortedPossiblePairs;

            if (bestPairForProfile exist) then (yes)
                :add (bestPairForProfile, score) to createdPairs;
                :remove all pairs containing one of bestPairForProfile's profile from sortedProfilesToPair;
                :remove bestPairForProfile profiles from sortedProfilesToPair;

                :findAPairInThisLoop = true;
            ' TODO: check if should not break the main loop in else case
            endif
        repeat while (next profile1 in sortedProfilesToPair)
    end group

    :save all pairs from createdPairs;
repeat while (findAPairInThisLoop == true?)

end
```

Note current restrictions that will probably be challenged or  be lifted later:
- 1 tandem per profile max
- 1 tandem proposition per profile
- Priorities
- Discover langage only with joker language
- Manage several learning langages


# Score computation

$$score_{total} = score_{language} + bonus_{age} + bonus_{roles} + bonus_{goals} + bonus_{university} + bonus_{gender} + bonus_{interests}$$

## Language score

A learning score of profile1 from profile2 is determined using the function `learningScore(profile1, profile2)`:
```plantuml
start
:learningLanguageMaxLevel = 5;
:disvoveryLearningLanguageMaxLevel = 6;
if (profile1.learningLanguage is discovery) then (yes)
    :learningScore = matrixDiscoveryLearningLanguage[profile1.learningLevel] /discoveryLearningLanguageMaxLevel;
else (no)
    :learningScore = matrixLearningLanguage[profile1.learningLevel] / learningLanguageMaxLevel;
endif
end
```

Then
$$ score = languageCoeficient * {learningScore(profile1, profile2) + learningScore(profile2, profile1) \over 2}$$

## Bonus

### Age bonus

Age bonus for profile1 and profile2 is determined with following function:
```plantuml
start
    :ageDifference = abs(profile1.age - profile2.age);

    if (profile1.age > 50 OR profile2.age > 50) then (yes)
        if (profile1.age > 50 AND profile2.age > 45) then (yes)
            :score = ageCoeficient;
            stop
        elseif (profile2.age > 50 AND profile1.age > 45) then (yes)
            :score = ageCoeficient;
            stop
        else (no)
            :score = 0;
            stop
        endif
    else (no)
    endif

    if (profile1.age > 30 OR profile2.age > 30) then (yes)
        if (ageDifference <= 10) then (yes)
            :score = ageCoeficient;
            stop
        else (no)
            :score = 0;
            stop
        endif
    else (no)
    endif

    if (ageDifference <= 3) then (yes)
        :score = ageCoeficient;
    else (no)
        :score = 0;
    endif
end
```

### Roles bonus

TODO

### Goals bonus

TODO

### University bonus

TODO

### Gender bonus

TODO

### Interests bonus

TODO

# Ideas

- Pair hash based on profiles to identify pair