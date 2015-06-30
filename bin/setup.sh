#!/bin/bash

tar -C ../RiTHM/ -xzf ltl3tools-0.0.7.tar.gz
cp ltl3tools.properties ../maven-repo/
cp rithm.sh ../maven-repo/
rm ../files/*
