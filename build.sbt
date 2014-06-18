name := "timelineWidget"

version := "1.0-SNAPSHOT"

libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache,
   "org.mnode.ical4j" % "ical4j" % "1.0.2",
   "net.sf.biweekly" % "biweekly" % "0.3.2"
)

libraryDependencies += "com.fasterxml.jackson.module" % "jackson-module-scala_2.10" % "2.1.3"


resolvers += (
    "Local Maven Repository" at "file:\\\\C:\\Users\\Grzesiek\\.m2\\repository"
)

play.Project.playScalaSettings

requireJs += "main.js"

requireJsShim += "main.js"

