# TFL Customer Service Process Documentation

- [TFL Customer Service Process Documentation](#tfl-customer-service-process-documentation)
  - [Abbreviations](#abbreviations)
  - [Deployment](#deployment)
    - [Pre-Requisites](#pre-requisites)
    - [Pre Deployment](#pre-deployment)
    - [Solution Deployment](#solution-deployment)
    - [Post Deployment](#post-deployment)
      - [Security](#security)
        - [TFL - Buses CC Team](#tfl---buses-cc-team)
        - [TFL - Overground CC Team](#tfl---overground-cc-team)
        - [TFL - Underground CC Team](#tfl---underground-cc-team)
        - [TFL - Customer Service Manager](#tfl---customer-service-manager)
        - [TFL - Escalation Team](#tfl---escalation-team)
        - [TFL - Confidential Case Team](#tfl---confidential-case-team)
  - [Design](#design)
    - [Customer Service Agent Process](#customer-service-agent-process)
    - [Customer Service Manager Process](#customer-service-manager-process)
      - [Create Follow Up Request Process](#create-follow-up-request-process)
    - [Escalation Team Process](#escalation-team-process)
    - [Confidential Case Team Process](#confidential-case-team-process)
  - [Unit Test Scenarios](#unit-test-scenarios)
  - [Appendix](#appendix)
    - [Entity Relationship Diagram](#entity-relationship-diagram)
    - [TFL Business Unit Structure](#tfl-business-unit-structure)
    - [Users used for testing](#users-used-for-testing)
    - [Additional Details](#additional-details)
      - [Source Code](#source-code)
      - [Web Resources](#web-resources)
      - [PowerAutomate](#powerautomate)
      - [Model Driven App](#model-driven-app)
      - [Business Process Flows](#business-process-flows)

## Abbreviations

CSA - Customer Service Agent

CSM - Customer Service Manager

BPF - Business Process Flow

## Deployment

### Pre-Requisites

Create a Customer Service Trial Instance

Note: If a trial account is created, please wait for couple of hours for the AD sync to happen. The account will be created with personal mail id, if created from personal mail id. Trial instance would take couple of hours to update the user id.

[Customer Service Trail Instance](https://dynamics.microsoft.com/en-us/customer-service/overview/)

### Pre Deployment

- Create **Microsoft Data Verse** connection in make.powerapps.com
- Import Data Maps for Business Unit and Teams ([Data Maps](./Data%20Maps))
- Import the Business Unit and Teams CSV's ([Data CSV's](./Data%20CSV's))

 For details on above steps related to data import, please refer the [Steps for Data Import](./Documents/Steps%20For%20Data%20Import.docx) document

### Solution Deployment

- Import the **TFL CC Solution** solution(managed/unmanaged) provided ([Solutions](./Solutions)).
- Connection reference mentioned in post deployment can be updated during solution import, if the solution is imported via make.powerapps.com instead of classic UI.

Note: Recommended to import managed solution

### Post Deployment

Please follow below steps post solution import

- Open the **Default Solution** solution in make.powerapps.com, navigate to connection references and update the connection for "TFL.DataVerse.ConnectionReference" and save.
- Navigate to **TFL - Customer Service Manager** Field Security Profile in the environment, and add **TFL - Customer Service Manager** team to member teams

#### Security

Please provide security roles for below mentioned teams in the CE environment

##### TFL - Buses CC Team

Business Unit : TFL - Buses Call Center

Security Roles

```bash
  TFL - Basic User
  TFL - Customer Service Agent
```

##### TFL - Overground CC Team

Business Unit : TFL - Overground Call Center

Security Roles

```bash
  TFL - Basic User
  TFL - Customer Service Agent
```

##### TFL - Underground CC Team

Business Unit : TFL - Underground Call Center

Security Roles

```bash
  TFL - Basic User
  TFL - Customer Service Agent
```

##### TFL - Customer Service Manager

Business Unit : Transport For London

Security Roles

```bash
  TFL - Basic User
  TFL - Customer Service Manager
```

Field Security Profiles

```bash
  TFL - Customer Service Manager
```

##### TFL - Escalation Team

Business Unit : Transport For London

Security Roles

```bash
  TFL - Basic User
  TFL - Escalation Team
```

##### TFL - Confidential Case Team

Business Unit : Transport For London

Security Roles

```bash
  TFL - Basic User
  TFL - Confidential Case Team
```

Please make sure all the processes in the solution are turned on.

## Design

**Customer Service App** model driven app is created and TFL user related security roles are given access and all the dashboards mentioned below are role specific

BPF Stages(Case - Customer Service Process)

- New Request (For CSA)
- Resolve/Follow Up
- Follow Up
- Resolved

### Customer Service Agent Process

When a CSA logged in to system, he/she can see a Dashboard(TFL Call Center Dashboard) through which he/she can see the active cases against his/her name, active cases assigned to his/her team and active cases assigned to his/her team members

CSA can create a contact and add attachments as well.

CSA can create a case for his/her Call Center(seperate Business Units created for this purpose). BPF is created for the defining the process of record flow.

At the time of case creation , CSA can enter the Case type(Problem/Request/Question) and Case Classification(Normal/Confidential) in **New Request** stage and fill all the other details along with attachments and move the BPF to next stage.

Once the BPF is moved to **Resolve/Follow Up** stage, a Power Automate(TFL.CaseBusinessProcess.OnChangeofBusinessProcessStage) is triggered to update the owner of the case to **TFL - Customer Service Manager** team.

When the stage is moved to **Resolve/Follow Up**, the Case Type and Case Classification fields on the BPF are locked down.

### Customer Service Manager Process

When a CSM logged in to system, he/she can see a Dashboard(TFL Customer Service Manager Dashboard) which display active cases assigned to his/her team. Dashboards contain the information related to Case Classification, Case Type, Escalated On(Follow Up Request Created Date),Follow up Days(number of days passed on create of follow up request)

CSM opens the case in **Resolve/Follow Up** stage, and only CSM can see the Resolve button(shown and hide based on security role of the user logged, displayed only for **TFL - Customer Service Manager** security role) and he/she can see Create Follow Up Activity(automation for creating follow up activity) field on the stage

Field security profile is enabled on **Create Follow Up Activity** field and only CSM can update this field.

CSM can either resolve the case or create a follow up

Once the CSM resolves the case the Records is deactivated and BPF stage is set to **Resolved**

#### Create Follow Up Request Process

When the CSM sets on **Create Follow Up Activity** flag to yes a pop-up is displayed for confirmation

- Clicking Yes, saves the record and closes the pop-up
- Clicking No, reverts the flag to no and closes the pop-up

When the CSM sets the flag to yes, a power automate(TFL.Case.OnCreateFollowUpActivity) is triggered which creates follow up activity record to either Confidential Team/Escalation team based on **case classification** and fetches all the notes(with attachment) against the Case and Contact record , iterate through each notes and create notes against follow up activity and sets the escalated flag on the Case entity which will update the Escalated On(Follow Up Date) and Follow Up Days(calculated field) and moves the BPF of the case record to **Follow Up** stage

### Escalation Team Process

When Escalation Team user logged in to system, he/she can see a Dashboard(Escalation Team Follow Up Request Dashboard) which displays the active follow up requests assigned to Escalation Team

Format of Follow Up Request subject - **Follow Up Request {CaseNumber}**
Eg: Follow Up Request CAS-01006-N3M3V8

Escalation Team user can view all the attachments against the case and contact in Follow Up Request record and he/she can provide the Description/Resolution Comments in text field.

### Confidential Case Team Process

When Confidential Case Team user logged in to system, he/she can see a Dashboard(Confidential Team Follow Up Request Dashboard) which displays the active follow up requests assigned to Confidential Case Team

Format of Follow Up Request subject - **Follow Up Request {CaseNumber}**
Eg: Follow Up Request CAS-01006-N3M3V8

Confidential Case Team user can view all the attachments against the case and contact in Follow Up Request record and he/she can provide the Description/Resolution Comments in text field.

## Unit Test Scenarios

Below are the list of Unit Test Scenarios. For screenshots from CE, please refer to [Unit Testing Documentation](./Documents/Unit%20Testing%20Documentation.docx).

![Unit Test Scenarios](<Images/Unit Test Scenarios.png>)

## Appendix

### Entity Relationship Diagram

![Entity Relationship Diagram](<Images/Entity Diagram for TFL CC Solution.png>)

### TFL Business Unit Structure

![TFL BU Structure](<Images/TFL BU Structure.png>)

### Users used for testing

![TestUsers](<Images/TestUsers.png>)

### Additional Details

#### Source Code

Path for Source Code [TFL.Source](./TFL.Source)

#### Web Resources

Javascripts

Each entity JS is divided into two parts Event Layer and Business Layer

Event Layer will have the list of events like onload, onSave, onClickOfButton, onChangeofField.

Business Layer will have the business logic for these events.

- Case Event Javascript File [Event.js](./TFL.Source/TFL.Repo.Source/WebResources/Case/Event.js)
- Case Business Javascript File [Business.js](./TFL.Source/TFL.Repo.Source/WebResources/Case/Business.js)

#### PowerAutomate

TFL.CaseBusinessProcess.OnChangeofBusinessProcessStage

TFL.Case.OnCreateFollowUpActivity

#### Model Driven App

Customer Service App

#### Business Process Flows

Case - Customer Service Process
