[PLANNED MODIFICATIONS]
Highest priority:
Normal priority:

[NEXT VERSION]
- [REFACTOR]: Factor out all common code between Either and Maybe

[1.2.2]
- [FIX]: Fix dist export for npm packaging

[1.2.1]
- [FEATURE]: Add a eitherFlow.debug method

[1.1.1]
- [FIX]: Fix Either isLeft() implementation: it was not calling its callback
  with its Left() value, defeating the whole purpose of the Either
  implementation :3

[1.1.0]
- [FEATURE]: Add an Either implementation

[1.0.0]
- [CHORE]: Have a proper lint/test/build/publish pipeline
- [DOC]: Add a README.md
- [MAJOR FEATURE]: Project initialization
