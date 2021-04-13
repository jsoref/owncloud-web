@public_link_share-feature-required @ocis-reva-issue-64
Feature: Create public link shares
  As a user
  I want to share files through a publicly accessible link
  So that users who do not have an account on my ownCloud server can access them

  Background:
    Given user "Alice" has been created with default attributes

  @smokeTest @issue-ocis-reva-383
  Scenario Outline: simple sharing by public link
    Given user "Alice" has logged in using the webUI
    When the user creates a new public link for resource "<shared-resource>" using the webUI
    Then user "Alice" should have a share with these details:
      | field       | value              |
      | share_type  | public_link        |
      | uid_owner   | Alice              |
      | permissions | read               |
      | path        | /<shared-resource> |
      | name        | Public link        |
    And a link named "Public link" should be listed with role "Viewer" in the public link list of resource "<shared-resource>" on the webUI
    When the public uses the webUI to access the last public link created by user "Alice"
    Then file "lorem.txt" should be listed on the webUI
    Examples:
      | shared-resource |
      | simple-folder   |
      | lorem.txt       |

  @skipOnOC10 @issue-ocis-reva-383
  # When this issue is fixed delete this scenario and use the one above
  Scenario Outline: simple sharing by public link (ocis bug demonstration)
    Given user "Alice" has logged in using the webUI
    When the user creates a new public link for resource "<shared-resource>" using the webUI
    Then user "Alice" should have a share with these details:
      | field       | value              |
      | share_type  | public_link        |
      | uid_owner   | Alice              |
      | permissions | read               |
      | path        | /<shared-resource> |
    And a public link with the last created link share token as name should be listed for resource "<shared-resource>" on the webUI
    When the public uses the webUI to access the last public link created by user "Alice"
    Then file "lorem.txt" should be listed on the webUI
    Examples:
      | shared-resource |
      | simple-folder   |
      | lorem.txt       |

  @issue-ocis-reva-389
  Scenario: user shares a public link with folder longer than 64 chars and shorter link name
    Given user "Alice" has renamed folder "simple-folder" to "aquickbrownfoxjumpsoveraverylazydogaquickbrownfoxjumpsoveralazydog"
    And user "Alice" has logged in using the webUI
    When the user creates a new public link for folder "aquickbrownfoxjumpsoveraverylazydogaquickbrownfoxjumpsoveralazydog" using the webUI with
      | name | short_linkname |
    And the public uses the webUI to access the last public link created by user "Alice"
    Then file "lorem.txt" should be listed on the webUI

  @skip @yetToImplement
  Scenario: share two file with same name but different paths by public link
    When the user creates a new public link for file "lorem.txt" using the webUI
    And the user closes the details dialog
    And the user opens folder "simple-folder" using the webUI
    And the user creates a new public link for file "lorem.txt" using the webUI
    And the user browses to the shared-by-link page
    Then file "lorem.txt" with path "" should be listed in the shared with others page on the webUI
    And file "lorem.txt" with path "/simple-folder" should be listed in the shared with others page on the webUI


  Scenario: user creates a multiple public link of a file and delete the first link
    Given user "Alice" has created a public link with following settings
      | path | lorem.txt  |
      | name | first-name |
    And user "Alice" has created a public link with following settings
      | path | lorem.txt   |
      | name | second-name |
    And user "Alice" has created a public link with following settings
      | path | lorem.txt  |
      | name | third-name |
    And user "Alice" has logged in using the webUI
    When the user removes the public link named "first-name" of file "lorem.txt" using the webUI
    Then public link named "first-name" should not be listed on the public links list on the webUI
    And a link named "second-name" should be listed with role "Viewer" in the public link list of file "lorem.txt" on the webUI
    And a link named "third-name" should be listed with role "Viewer" in the public link list of folder "lorem.txt" on the webUI


  Scenario: user creates a multiple public link of a file and delete the second link
    Given user "Alice" has created a public link with following settings
      | path | lorem.txt  |
      | name | first-name |
    And user "Alice" has created a public link with following settings
      | path | lorem.txt   |
      | name | second-name |
    And user "Alice" has created a public link with following settings
      | path | lorem.txt  |
      | name | third-name |
    And user "Alice" has logged in using the webUI
    When the user removes the public link named "second-name" of file "lorem.txt" using the webUI
    Then public link named "second-name" should not be listed on the public links list on the webUI
    And a link named "first-name" should be listed with role "Viewer" in the public link list of file "lorem.txt" on the webUI
    And a link named "third-name" should be listed with role "Viewer" in the public link list of folder "lorem.txt" on the webUI


  Scenario: user creates a multiple public link of a file and delete the third link
    Given user "Alice" has created a public link with following settings
      | path | lorem.txt  |
      | name | first-name |
    And user "Alice" has created a public link with following settings
      | path | lorem.txt   |
      | name | second-name |
    And user "Alice" has created a public link with following settings
      | path | lorem.txt  |
      | name | third-name |
    And user "Alice" has logged in using the webUI
    When the user removes the public link named "third-name" of file "lorem.txt" using the webUI
    Then public link named "third-name" should not be listed on the public links list on the webUI
    And a link named "first-name" should be listed with role "Viewer" in the public link list of file "lorem.txt" on the webUI
    And a link named "second-name" should be listed with role "Viewer" in the public link list of folder "lorem.txt" on the webUI

  @skip @yetToImplement
  Scenario: user creates public link with view and upload feature
    When the user creates a new public link for folder "simple-folder" using the webUI with
      | permission | upload-write-without-modify |
    And the public accesses the last created public link using the webUI

  Scenario Outline: user creates multiple public links with same name for the same file/folder
    Given user "Alice" has logged in using the webUI
    When the user creates a new public link for <element> "<name>" using the webUI with
      | name | same_link_name |
    And the user creates a new public link for <element> "<name>" using the webUI with
      | name | same_link_name |
    Then the tokens should be unique for each public links on the webUI
    Examples:
      | element | name          |
      | folder  | simple-folder |
      | file    | lorem.txt     |

  @issue-ocis-reva-243
  Scenario: User can create a public link via quick action
    Given user "Alice" has logged in using the webUI
    When the user creates a public link via quick action for resource "simple-folder" using the webUI
    Then user "Alice" should have a share with these details:
      | field       | value             |
      | share_type  | public_link       |
      | uid_owner   | Alice             |
      | permissions | read              |
      | path        | /simple-folder    |
      | name        | Quick action link |
    And the following success message should be displayed on the webUI
      """
      Public link created
      Public link has been successfully created and copied into your clipboard.
      """