# Terraform

## Purpose

This semester I've had lots of experiences with cloud computing. I've had experiences
in this class (329), as well as in 340. Additionally, I hosted my own personal website
for attempting to help immigrants get their green cards. During this time, I've noticed
how many mistakes can be made when doing "click-ops". I wanted to learn more about
making more reproducable and scalable infrastructure. This lead me to the topic of
**"infrastructure as software"**, which lead me to Terraform. This document
records my findings on the history, benefits, and some personal documentation
for how to practically use Terraform

## History

Terraform was founded as an open source, declarative syntax in 2014 by Mitchell Hashimoto
at HashiCorp. They needed a tool that would allow for much larger scale infrastucture,
and Terraform was the solution.

It appears that somewhere between 2016, as cloud computing really exploded, Terraform became
mainstream. Now there are other providers similar to Terraform, but it still appears that
Terraform is the best option, especially since it is compatible accross multiple cloud
providers

## Benefits

### NO ClICK-OPS!

While taking 340, I heavily utilized AWS API Gateway and AWS Lambdas.
I quickly realized how annoying it was to have to manually click and type things into
the aws console whenever I made any changes or deployed my code. I eventually
made some of my own bash scripts that utilized the aws cli, but Terraform could
take all of this away. No more need to open AWS. Everything can be controlled by code

### Can Save Money / Safer

In this class, we always have our application running. The cool thing about terraform is
that you can easily tear down and redeploy applications. Although the jwt-pizza application
is relatively cheap, if there was an applicatin that was more expensive to run but only needed to
run for a portion of the day, it would be easy to tear down and rebuild the application.

Along with this, because it is so easy to deploy and tear down, if something crashes or goes wrong,
it is super easy to redeploy just as it was, or even redeploy to a state it was at before.

### Cross Cloud Provider Availability

One of the coolest things I think about Terraform is it's cross platform compatability. Recently I've
been learning a lot about AWS, but if I just learn Terraform, these skills can easily be transferred over to
Azure or any other cloud provider.

### Stateful / Version Controlled

Another great benefit of Terraform is that it is stateful and version controlled. This
means that Terraform has a record of the current state of the cloud environment that everyone
can easily see. This state and the code that changes the state can easily be version controlled
so that everyone knows what changed, when it changed, and who changed it. These
are big perks for developers.

## Documentation

These are just a couple of useful concepts I learned from some videos about
how to use Terraform

### Main files

Terraform starts off with a main file, usually called Main.tf.
This is where all of the main code goes for actually spinning up
EC2s, or interacting with the cloud service.

### Variables

To have default variales, or variables that can change, create
a variables.tf file.

### Custom Vars

To change the variables, create a variables.tf file. Then the
variables can be changed by command line args or by scripted
code.

### Maintaining State

State is held in a terrafrom.tfstate file. A backup can be in terrafrom.tfstate.backup
