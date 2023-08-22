# Global

## Constraints

Base constraints:

- A pair must concern at least one user from central university
- User must learn from each other (principle 1)

## Forbidden rules

There are forbidden rules:
- User wanting "tandem" mode must be paired with user wanting "tandem" mode, users must be on same site
- user which specified same gender cannot be paired with someone of different gender

### Bonuses

We'll try to create strong pairs based on 2 points: similarity and complementarity.

Bonus points on similarity for:

- Same motivation: aims to get a certificate
- Age: aims to have close ages
- Interests: aims to have same interests
- statuses / roles: students with students and staff with staff


# Global routine

Global routine will provide suggestions for global tandem creation.

It should respect all global rules

## First implementation: naive routine

At first, the global routine will be naive.
It will compute the score of all possible pairs and will extract the best pairs.
It will retry until it found acceptable pairs.

Pair will be extracted for user by date of inscription.
In a second time, other priorities could be introduced in the order of pair extration. Such as :
1. Staff before student
2. Specific program before

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
                    else (yes)
                    endif
                else (no)
                endif
            repeat while (next profile2 in group B?)
        repeat while (next profile1 in group A?)
        :sortedPossiblePairs = sort possiblePairs by pair score;
    end group

    :sortedProfilesToPair = profilesToPair sorted by inscription date;

    group Global routine: find best combinaisons among possible pairs
        :createdPairs = [];
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

## Bonus scores

### Age

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

### Roles

TODO

### Goals

TODO

### University

TODO

### Gender

TODO

### Interests

TODO

# Ideas

- Pair hash based on profiles to identify pair