package utils

import java.io.{StringWriter, ByteArrayInputStream, FileInputStream, File}
import net.fortuna.ical4j.model.{Property, Calendar}
import net.fortuna.ical4j.data.CalendarBuilder
import com.sun.xml.internal.messaging.saaj.util.ByteInputStream
import biweekly.Biweekly
import models.EventBuilder
import org.joda.time.DateTime
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.scala.DefaultScalaModule
import scala.collection.JavaConversions._

class ICalParser {

  val mapper = new ObjectMapper()
  mapper.registerModule(DefaultScalaModule)

  def parseIcalFile(file : File) = {
    val iCalList = Biweekly.parse(file).first()

    val iCalEvents = iCalList.getEvents

    var jsonRoot = mapper.createObjectNode

    var eventsArray = mapper.createArrayNode()

    iCalEvents.toList.foreach(iCalEvent => {
      val event = EventBuilder.builder
        .withUid(iCalEvent.getUid.getValue.asInstanceOf[String])
        .withStartTime(new DateTime(iCalEvent.getDateStart.getValue).getMillis)
        .withEndTime(new DateTime(iCalEvent.getDateEnd.getValue).getMillis)
        .withSummary(iCalEvent.getSummary.getValue)
        .withDescription(iCalEvent.getDescription.getValue)
        .withLocation(iCalEvent.getLocation.getValue)
        .withGeo((iCalEvent.getGeo.getLatitude, iCalEvent.getGeo.getLongitude))
        .build

      val jsonString = mapper.writeValueAsString(event)
      eventsArray.add(mapper.readTree(jsonString))
    })
    jsonRoot.put("name", file.getPath)
    jsonRoot.put("events", eventsArray)

    jsonRoot.toString
  }
}
